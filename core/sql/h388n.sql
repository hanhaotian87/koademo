CREATE TEMPORARY TABLE mongodb_sink (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    platform VARCHAR,
    devType VARCHAR,
    fireAlarm BIGINT,
    integralAlarm BIGINT,
    powerAlarm BIGINT
  )
with (
    'connector' = 'mongodb',
    'database' = 'fhsjdb',
    'collection' = 'dc_h388nh389nAlarm',
    'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341'
  );
-- in 子查询元素不能超过7个
-- type 要是 deviceMessage
CREATE TEMPORARY VIEW nbResult AS (
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].devType') in ('H388N', 'H389N')
      and JSON_VALUE (content, '$[0].content[*].streamId') = 'fireAlarm'
      and JSON_VALUE (content, '$[0].content[*].type') = 'alarm'
    INSERT INTO mongodb_sink
    SELECT
      TUMBLE_START (ts, INTERVAL '1' HOUR),
      TUMBLE_END (ts, INTERVAL '1' HOUR), (
        CASE
          WHEN nbResult.platform = 'AEP' THEN 'AEP'
          WHEN nbResult.platform = 'production' THEN 'OC'
          WHEN nbResult.platform = 'test' THEN 'OC'
          WHEN nbResult.platform = 'onenet' THEN 'OneNet' ELSE '3JYUN'
        END
      ) AS platform,
      nbResult.devType,
      count (*)
    FROM
      nbResult
    GROUP BY TUMBLE (ts, INTERVAL '1' HOUR), nbResult.platform, nbResult.devType
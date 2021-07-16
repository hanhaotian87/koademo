CREATE TEMPORARY TABLE mq_source(
    content VARCHAR,
    ts as PROCTIME()
) WITH (
    'connector' = 'mq',
    'endpoint'='http://onsaddr.cn-shenzhen.mq-internal.aliyuncs.com:8080',
    'accessId'='LTAI4GGYQxBjeW4JpAku7Eti',
    'accessKey'='odkvkHQXs6R6me5S23ja2WtP6ZCLJN',
    'topic'='3jyun_alm_dev_order',
    'consumerGroup'='GID_FLINK_DEV',
    'tag'='*',
    'encoding'='utf-8'
);

CREATE TEMPORARY TABLE blackhole_sink(
       window_start TIMESTAMP,
       window_end TIMESTAMP,
       nb_count BIGINT
) with (
    'connector' = 'blackhole'
);

--INSERT INTO blackhole_sink SELECT content from mq_source;


INSERT INTO blackhole_sink SELECT 
TUMBLE_START(ts, INTERVAL '1' MINUTE),
TUMBLE_END(ts, INTERVAL '1' MINUTE),
COUNT(content)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK') 
GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE);



CREATE TEMPORARY TABLE blackhole_sink(
       nb_count BIGINT
) with (
    'connector' = 'blackhole'
);

--INSERT INTO blackhole_sink SELECT content from mq_source;


INSERT INTO blackhole_sink SELECT 
COUNT(content)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK');


CREATE TEMPORARY TABLE blackhole_sink(
      window_start TIMESTAMP,
       window_end TIMESTAMP,
       nb_count BIGINT
) with (
    'connector' = 'blackhole'
);


INSERT INTO blackhole_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE),TUMBLE_END(ts, INTERVAL '1' MINUTE),
COUNT(content)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK') GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE),content;



CREATE TEMPORARY TABLE mq_source(
    content VARCHAR,
    ts as PROCTIME()
) WITH (
    'connector' = 'mq',
    'endpoint'='xx',
    'accessId'='xx',
    'accessKey'='xx',
    'topic'='3jyun_alm_dev_order',
    'consumerGroup'='GID_FLINK_DEV',
    'tag'='*',
    'encoding'='utf-8'
);

CREATE TEMPORARY TABLE blackhole_sink(
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    nb_reqs BIGINT
) with (
    'connector' = 'blackhole'
);


INSERT INTO blackhole_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '1' MINUTE) as window_end,
COUNT(content)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK') GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE),content;


CREATE TEMPORARY TABLE blackhole_sink(
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    nb_reqs BIGINT
) with (
    'connector' = 'mongodb',
   'database' = 'fhsjdb',
   'collection' = 'nb_req', 
   'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341',
   'maxConnectionIdleTime' = '5',  
   'batchSize' = '1024'  
);


INSERT INTO blackhole_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '1' MINUTE) as window_end,
COUNT(content)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK') GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE),content;



CREATE TEMPORARY TABLE blackhole_sink(
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    nb_reqs BIGINT
) with (
    'connector' = 'mongodb',
   'database' = 'fhsjdb',
   'collection' = 'nbRequest', 
   'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341' 
);


INSERT INTO blackhole_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '1' MINUTE) as window_end,
COUNT(*)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('MANDUN-KK') GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE);




CREATE TEMPORARY TABLE mq_source(
    content VARCHAR,
    ts as proctime()
) WITH (
    'connector' = 'mq',
    'endpoint'='http://onsaddr.cn-shenzhen.mq-internal.aliyuncs.com:8080',
    'accessId'='LTAI4GGYQxBjeW4JpAku7Eti',
    'accessKey'='odkvkHQXs6R6me5S23ja2WtP6ZCLJN',
    'topic'='3jyun_alm_dev_order',
    'consumerGroup'='GID_FLINK_DEV',
    'tag'='*',
    'encoding'='utf-8',
    'pullIntervalMs'='1000'
    
);

CREATE TEMPORARY TABLE mongodb_sink(
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    nb_reqs BIGINT
) with (
    'connector' = 'mongodb',
   'database' = 'fhsjdb',
   'collection' = 'nbRequest', 
   'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341' 
);


INSERT INTO mongodb_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '1' MINUTE) as window_end,
COUNT(*)  from mq_source  GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE);

val sql =
  """
    SELECT content from SimpleTable where JSON_VALUE(content, '$[0].devType') IN (
    'CTNBSmokeSensor','H388N','H389N','GHL-IRD')
    UNION
    SELECT content from SimpleTable WHERE JSON_VALUE(content, '$[0].devType') IN (
    'JY-BF-20YN','HC809','DH-9908N-AEP','DH-9908N')
    """.stripMargin


    INSERT INTO mongodb_sink
SELECT TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*) FROM (SELECT
  *
from
  mq_source
where
  JSON_VALUE (content, '$[0].devType') in (
    'CTNBSmokeSensor',
    'JTQ-BF-06TN',
    'DH-9708N',
    'DH-9908N',
    'H388N',
    'H389N',
    'AepWingSmoker'
  )
UNION
SELECT
  *
from
  mq_source
where
  JSON_VALUE (content, '$[0].devType') in (
    'WD-YDH32P',
    'CMCC-NG1A',
    'XIAOAN-KG',
    'JD-GAS',
    'S270N',
    'DH-9908N-AEP',
    'MINGKONG_YY'
  )
UNION
SELECT
  *
from
  mq_source
where
  JSON_VALUE (content, '$[0].devType') in (
    'MINGKONG_YW',
    'MINGKONG_XY',
    'MINGKONG_QY',
    'GHL-IRD',
    'JT-BF-20TN',
    'JY-BF-20YN',
    'HC809'
  )
)
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE);


---------
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE) as window_start,
  TUMBLE_END (ts, INTERVAL '1' MINUTE) as window_end,
  COUNT (*)
from
  mq_source
where
  JSON_VALUE (content, '$[0].type') = 'deviceMessage'
  and JSON_VALUE (content, '$[0].content[*]') is not NULL
  and JSON_VALUE (content, '$[0].devType') in (
    'CTNBSmokeSensor',
    'H388N',
    'H389N',
    'GHL-IRD',
    'JT-BF-20TN',
    'HC809',
    'DH-9908N-AEP'
  )
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE);

------

CREATE TEMPORARY VIEW nbResult AS
SELECT
  *
from
  mq_source
where
  JSON_VALUE (content, '$[0].type') = 'deviceMessage'
  and JSON_VALUE (content, '$[0].content[*]') is not NULL
  and JSON_VALUE (content, '$[0].devType') in (
    'CTNBSmokeSensor',
    'H388N',
    'H389N',
    'GHL-IRD',
    'JT-BF-20TN',
    'HC809',
    'DH-9908N-AEP'
  );
---------
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
FROM
  nbResult
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE);

-------

CREATE TEMPORARY VIEW nbResult AS
SELECT
  *
from
  mq_source
where
  JSON_VALUE (content, '$[0].type') = 'deviceMessage'
  and JSON_VALUE (content, '$[0].content[*]') is not NULL
  and JSON_VALUE (content, '$[0].devType') in (
    'CTNBSmokeSensor',
    'H388N',
    'H389N',
    'GHL-IRD',
    'JT-BF-20TN',
    'HC809',
    'DH-9908N-AEP'
  );

INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  JSON_VALUE (nbResult.content, '$[0].platform'),
  count (*)
FROM
  nbResult
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE), JSON_VALUE (nbResult.content, '$[0].platform');


----------------


--********************************************************************--
-- Author:         huiyun.han@fhsj.onaliyun.com
-- Created Time:   2021-04-26 14:43:57
-- Description:    NB设备请求数根据平台和设备类型分类统计，离线消息数
--********************************************************************--
CREATE TEMPORARY TABLE mq_source (content VARCHAR, ts as proctime ())
WITH (
    'connector' = 'mq',
    'endpoint' = 'http://onsaddr.cn-shenzhen.mq-internal.aliyuncs.com:8080',
    'accessId' = 'LTAI4GGYQxBjeW4JpAku7Eti',
    'accessKey' = 'odkvkHQXs6R6me5S23ja2WtP6ZCLJN',
    'topic' = '3jyun_alm_dev_order',
    'consumerGroup' = 'GID_FLINK_DEV',
    'tag' = '*',
    'encoding' = 'utf-8',
    'pullIntervalMs' = '1000',
    'columnErrorDebug' = 'true'
  );
CREATE TEMPORARY TABLE mongodb_sink (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    platform VARCHAR,
    devType VARCHAR,
    nb_uplinks BIGINT
  )
with ('connector' = 'print', 'logger' = 'true');

CREATE TEMPORARY TABLE mongodb_sink1 (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    platform VARCHAR,
    devType VARCHAR,
    offlines BIGINT
  )
with ('connector' = 'print', 'logger' = 'true');


-------
CREATE TEMPORARY VIEW nbUplink AS (
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content[*]') is not NULL
      and JSON_VALUE (content, '$[0].devType') in (
        'CTNBSmokeSensor',
        'JTQ-BF-06TN',
        'DH-9708N',
        'DH-9908N',
        'H388N',
        'H389N',
        'AepWingSmoker'
      )
    UNION ALL
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content[*]') is not NULL
      and JSON_VALUE (content, '$[0].devType') in (
        'WD-YDH32P',
        'CMCC-NG1A',
        'XIAOAN-KG',
        'JD-GAS',
        'S270N',
        'DH-9908N-AEP',
        'MINGKONG_YY'
      )
    UNION ALL
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content[*]') is not NULL
      and JSON_VALUE (content, '$[0].devType') in (
        'MINGKONG_YW',
        'MINGKONG_XY',
        'MINGKONG_QY',
        'GHL-IRD',
        'JT-BF-20TN',
        'JY-BF-20YN',
        'HC809'
      )
  );


CREATE TEMPORARY VIEW nbOffline AS (
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content.streamId') = 'online'
      and JSON_VALUE (content, '$[0].content.data') = '{{dataType.deviceOffline}}'
      and JSON_VALUE (content, '$[0].devType') in (
        'CTNBSmokeSensor',
        'JTQ-BF-06TN',
        'DH-9708N',
        'DH-9908N',
        'H388N',
        'H389N',
        'AepWingSmoker'
      )
    UNION ALL
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content.streamId') = 'online'
      and JSON_VALUE (content, '$[0].content.data') = '{{dataType.deviceOffline}}'
      and JSON_VALUE (content, '$[0].devType') in (
        'WD-YDH32P',
        'CMCC-NG1A',
        'XIAOAN-KG',
        'JD-GAS',
        'S270N',
        'DH-9908N-AEP',
        'MINGKONG_YY'
      )
    UNION ALL
    SELECT
      JSON_VALUE (mq_source.content, '$[0].platform') as platform,
      JSON_VALUE (mq_source.content, '$[0].devType') as devType,
      JSON_VALUE (mq_source.content, '$[0].devId') as devId,
      ts
    from
      mq_source
    where
      JSON_VALUE (content, '$[0].type') = 'deviceMessage'
      and JSON_VALUE (content, '$[0].content.streamId') = 'online'
      and JSON_VALUE (content, '$[0].content.data') = '{{dataType.deviceOffline}}'
      and JSON_VALUE (content, '$[0].devType') in (
        'MINGKONG_YW',
        'MINGKONG_XY',
        'MINGKONG_QY',
        'GHL-IRD',
        'JT-BF-20TN',
        'JY-BF-20YN',
        'HC809'
      )
  );
BEGIN STATEMENT SET;
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE), (
    CASE
      WHEN nbUplink.platform = 'AEP' THEN 'AEP'
      WHEN nbUplink.platform = 'production' THEN 'OC'
      WHEN nbUplink.platform = 'test' THEN 'OC'
      WHEN nbUplink.platform = 'onenet' THEN 'OneNet' ELSE '3JYUN'
    END
  ) AS platform,
  nbUplink.devType,
  count (*)
FROM
  nbUplink
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE),
  nbUplink.platform,
  nbUplink.devType;

  INSERT INTO mongodb_sink1
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE), (
    CASE
      WHEN nbOffline.platform = 'AEP' THEN 'AEP'
      WHEN nbOffline.platform = 'production' THEN 'OC'
      WHEN nbOffline.platform = 'test' THEN 'OC'
      WHEN nbOffline.platform = 'onenet' THEN 'OneNet' ELSE '3JYUN'
    END
  ) AS platform,
  nbOffline.devType,
  count (*)
FROM
  nbOffline
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE),
  nbOffline.platform,
  nbOffline.devType;

  END;  
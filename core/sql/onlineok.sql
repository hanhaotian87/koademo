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

CREATE TEMPORARY TABLE blackhole_sink(
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    nb_reqs BIGINT
) with (
    'connector' = 'print',
    'logger' = 'true'
);


INSERT INTO blackhole_sink SELECT TUMBLE_START(ts, INTERVAL '1' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '1' MINUTE) as window_end,
COUNT(*)  from mq_source  GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE);



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

--mongodb 白名单
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


INSERT INTO mongodb_sink SELECT TUMBLE_START(ts, INTERVAL '15' MINUTE) as window_start, TUMBLE_END(ts, INTERVAL '15' MINUTE) as window_end,
COUNT(*)  from mq_source where JSON_VALUE(content, '$[0].devType') in ('CTNBSmokeSensor', 'JTQ-BF-06TN', 'DH-9708N', 'DH-9908N', 'H388N', 'H389N', 'AepWingSmoker', 'WD-YDH32P', 'CMCC-NG1A',
'XIAOAN-KG', 'JD-GAS', 'S270N', 'DH-9908N-AEP', 'MINGKONG_YY', 'MINGKONG_YW', 'MINGKONG_XY', 'MINGKONG_QY', 'GHL-IRD', 'JT-BF-20TN', 'JY-BF-20YN', 'HC809')  GROUP BY TUMBLE(ts, INTERVAL '15' MINUTE);



--********************************************************************--
-- Author:         huiyun.han@fhsj.onaliyun.com
-- Created Time:   2021-04-26 17:19:04
-- Description:    Write your description here
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
    nb_reqs BIGINT
  )
with ('connector' = 'print', 'logger' = 'true');
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE)
UNION
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE)
UNION
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE);


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
    nb_reqs BIGINT
  )
with (
    'connector' = 'mongodb',
    'database' = 'fhsjdb',
    'collection' = 'nbReportStatistics',
    'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341'
  );
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE)
UNION ALL
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE)
UNION ALL
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
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
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE);


--********************************************************************--
-- Author:         huiyun.han@fhsj.onaliyun.com
-- Created Time:   2021-04-26 17:19:04
-- Description:    Write your description here
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
    nb_reqs BIGINT
  )
with (
    'connector' = 'mongodb',
    'database' = 'fhsjdb',
    'collection' = 'nbReportStatistics',
    'uri' = 'mongodb://fhsjaaa:hello123@dds-wz9368239dc012441.mongodb.rds.aliyuncs.com:3717,dds-wz9368239dc012442.mongodb.rds.aliyuncs.com:3717/fhsjdb?replicaSet=mgset-7970341'
  );
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE),
  COUNT (*)
FROM (
    SELECT
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
    UNION ALL
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
    UNION ALL
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


----

CREATE TEMPORARY VIEW nbResult AS
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
  nbResult.platform,
  count (*)
FROM
  nbResult
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE), nbResult.platform;


----

CREATE TEMPORARY TABLE mongodb_sink (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    platform VARCHAR,
    devType VARCHAR,
    devId VARCHAR,
    nb_reqs BIGINT
  )
with ('connector' = 'print', 'logger' = 'true');
-------
CREATE TEMPORARY VIEW nbResult AS
(SELECT
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
  ) UNION 
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
  ) UNION 
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
INSERT INTO mongodb_sink
SELECT
  TUMBLE_START (ts, INTERVAL '1' MINUTE),
  TUMBLE_END (ts, INTERVAL '1' MINUTE), (
    CASE
      WHEN nbResult.platform = 'AEP' THEN 'AEP'
      WHEN nbResult.platform = 'production' THEN 'OC'
      WHEN nbResult.platform = 'test' THEN 'OC'
      WHEN nbResult.platform = 'onenet' THEN 'OneNet' ELSE '3JYUN'
    END
  ) AS platform,
  nbResult.devType,
  nbResult.devId,
  count (*)
FROM
  nbResult
GROUP BY TUMBLE (ts, INTERVAL '1' MINUTE),
  nbResult.platform,
  nbResult.devType,
  nbResult.devId;
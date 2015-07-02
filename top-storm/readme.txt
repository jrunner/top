wmvn archetype:create -DgroupId=com.topsec.tss -DartifactId=tss-kafka
mvn clean install
mvn eclipse:myeclipse-clean eclipse:myeclipse -DdownloadSources=true -DdownloadJavadocs=true


----------业务逻辑相关的sql------------------------------
DROP TABLE `real_order`;
CREATE TABLE `real_order` (
	`id`  int NOT NULL AUTO_INCREMENT COMMENT '订单号' ,
	`totalPrice`  double  COMMENT '总价' ,
	`youhui`  double  COMMENT '优惠价格' ,
	`memberid`    varchar(10) COMMENT '用户id' ,
	`sendpay`  int  COMMENT '标识字段' ,
	`createdate`  datetime  COMMENT '下单时间' ,
	PRIMARY KEY (`id`)
);
INSERT INTO `real_order`(totalPrice,youhui,memberid,sendpay,createdate) VALUES (100, 2, 10000, '1', '2014-8-9 01:09:22');
INSERT INTO `real_order`(totalPrice,youhui,memberid,sendpay,createdate) VALUES (100, 1, 10001, '1', '2014-8-9 01:09:52');
INSERT INTO `real_order`(totalPrice,youhui,memberid,sendpay,createdate) VALUES (100, 2, 10001, '2', '2014-8-9 01:18:07');
INSERT INTO `real_order`(totalPrice,youhui,memberid,sendpay,createdate) VALUES (100, 2, 10001, '4', '2014-8-9 01:22:18');
INSERT INTO `real_order`(totalPrice,youhui,memberid,sendpay,createdate) VALUES (100, 1, 10001, '1', '2014-8-9 01:24:15');

select 
	count(id) '有效订单',
	sum(totalPrice) '优惠前定金',
	sum(totalPrice - youhui) '优惠后的价格',
	count(distinct memberid) '下单用户数',

	case 
	when sendpay=1  then 1 
  when sendpay=2  then 2
	else -1  end '手机客户端下单标记'
 from real_order

where createdate >= '2014-08-09'
group by 	
case 
	when sendpay=1  then 1 
  when sendpay=2  then 2
	else -1  end 
----------------------------------------

1. web消息发送数据到kafka
2. storm从kafka上取数据
	a.首先storm和卡夫卡整合--引入插件
	b.简单需要一个topology，读数据，打印数据
	c.通过业务编写代码。
Map key = sendpay
	value = count(distinct memberid) => 去重复==》key/value=>memcached (sendpay,date)=>sendpay
3. 将数据入库

订单号	用户id		原金额		优惠价	标识字段	下单时间
id	memberid	totalprice	youhui	sendpay		createdate



http://192.168.72.31:8089/index.html

在nimbus上
$storm nimbus

在每个supervisor上
$storm supervisor

在nimbus上重新开个console，运行
$storm ui

nohup storm nimbus &
nohup storm supervisor &
nohup storm ui &

#启动
zkServer.sh start
bin/kafka-server-start.sh config/server.properties
nohup ~/hdfs/kafka_2.8.0-0.8.1/bin/zookeeper-server-start.sh ~/hdfs/kafka_2.8.0-0.8.1/config/zookeeper.properties &
nohup ~/hdfs/kafka_2.8.0-0.8.1/bin/kafka-server-start.sh ~/hdfs/kafka_2.8.0-0.8.1/config/server.properties &

#创建和查看
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
bin/kafka-topics.sh --list --zookeeper localhost:2181

#生产和消费
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning

#copy jar包到storm的lib下
cp /home/tss/hdfs/kafka_2.8.0-0.8.1/libs/kafka_2.8.0-0.8.1.jar ~/hdfs/apache-storm-0.9.1-incubating/lib/
cp /home/tss/hdfs/kafka_2.8.0-0.8.1/libs/scala-library-2.8.0.jar ~/hdfs/apache-storm-0.9.1-incubating/lib/
cp /home/tss/hdfs/kafka_2.8.0-0.8.1/libs/metrics-core-2.2.0.jar ~/hdfs/apache-storm-0.9.1-incubating/lib/
cp /home/tss/hdfs/kafka_2.8.0-0.8.1/libs/snappy-java-1.0.5.jar ~/hdfs/apache-storm-0.9.1-incubating/lib/

 storm jar tss-storm-0.0.1-SNAPSHOT.jar com.topsec.tss.topology.OrderTopology
 
  /opt/memcached/bin/memcached -d -m 128 -u root -l 127.0.0.1 -p 12121 -c 256 -P /tmp/memcached.pid
  ./memcached -d -m 2048 -l 127.0.0.1 -p 11211 -u root
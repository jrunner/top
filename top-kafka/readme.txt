mvn archetype:create -DgroupId=com.topsec.tss -DartifactId=tss-kafka
mvn clean install
mvn eclipse:myeclipse-clean eclipse:myeclipse -DdownloadSources=true -DdownloadJavadocs=true

select 
	count(id) 有效订单,
	sum(totalPrice) 优惠前定金,
	sum(totalPrice - youhui) 优惠后的价格,
	count(distinct memberid) 下单用户数,
	case when substring(sendpay,9,1)='1' 
	then 1 when substring(sendpay,9,1)=2 
	else = -1 
	end 手机客户端下单标记
 from realtime_orders
where createdate >= '2014-04-19'
group by case when substring(sendpay,9,1)='1' then 
	substring(sendpay,9,1)='2' 
	end;

1. web消息发送数据到kafka
2. storm从kafka上取数据
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
bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
nohup bin/kafka-server-start.sh config/server.properties &

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
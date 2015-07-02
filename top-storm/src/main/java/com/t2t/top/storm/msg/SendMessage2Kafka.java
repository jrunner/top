package com.t2t.top.storm.msg;

import java.util.Properties;
import java.util.Random;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;

/**
 * 发送数据到kafka上
 * 
 * @author ypf
 */
public class SendMessage2Kafka {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Properties props = new Properties();
		props.put("zookeeper.connect", "node1:2181");
		props.put("serializer.class", "kafka.serializer.StringEncoder");
		props.put("producer.type", "async");
		props.put("compression.codec", "1");
		props.put("metadata.broker.list", "node1:9092");

		ProducerConfig config = new ProducerConfig(props);
		Producer<String, String> producer = new Producer<String, String>(config);

		Random r = new Random();
		for (int i = 0; i < 1; i++) {
			int id = r.nextInt(10000000);// 订单号
			int memberid = r.nextInt(100000);// 用户id
			int totalprice = r.nextInt(1000) + 100;// 原金额
			int youhui = r.nextInt(100);// 优惠价
			int sendpay = r.nextInt(3);// 标识字段

			StringBuffer data = new StringBuffer();
			data.append(String.valueOf(id)).append("\t").append(String.valueOf(memberid)).append("\t").append(String.valueOf(totalprice)).append("\t").append(String.valueOf(youhui)).append("\t").append(String.valueOf(sendpay)).append("\t").append("2014-04-19");
			System.out.println(data.toString());
			producer.send(new KeyedMessage<String, String>("test", data.toString()));
		}

		producer.close();
		System.out.println("send over ------------------");
	}

}

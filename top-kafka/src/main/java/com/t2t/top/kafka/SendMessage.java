package com.t2t.top.kafka;

import java.util.Properties;
import java.util.Random;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;

public class SendMessage {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Properties props = new Properties();
		props.put("zookeeper.connect", "w22.node:2181");
		props.put("serializer.class", "kafka.serializer.StringEncoder");
		props.put("producer.type", "async");
		props.put("compression.codec", "1");
		props.put("metadata.broker.list", "w22.node:9092");

		ProducerConfig config = new ProducerConfig(props);
		Producer<String, String> producer = new Producer<String, String>(config);

		Random r = new Random();
		for (int i = 0; i < 10; i++) {
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

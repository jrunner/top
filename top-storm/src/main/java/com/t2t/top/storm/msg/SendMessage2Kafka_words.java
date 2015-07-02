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
public class SendMessage2Kafka_words {

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

			StringBuffer data = new StringBuffer();
			data.append("a b c d e aa bb cc dd e\r\n");
			data.append("测试");
			System.out.println(data.toString());
			producer.send(new KeyedMessage<String, String>("doword", data.toString()));
		}

		producer.close();
		System.out.println("send over ------------------");
	}

}

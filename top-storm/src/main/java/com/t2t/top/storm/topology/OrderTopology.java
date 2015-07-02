package com.t2t.top.storm.topology;

import storm.kafka.KafkaSpout;
import storm.kafka.SpoutConfig;
import storm.kafka.StringScheme;
import storm.kafka.ZkHosts;
import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.StormSubmitter;
import backtype.storm.spout.SchemeAsMultiScheme;
import backtype.storm.topology.TopologyBuilder;

import com.google.common.collect.ImmutableList;
import com.t2t.top.storm.bolt.CheckBolt;
import com.t2t.top.storm.bolt.OrderBolt;
import com.t2t.top.storm.bolt.TranslateBolt;

/**
 * 实时统计订单统计
 * 
 * @author ypf
 */
public class OrderTopology {
	public static void main(String[] args) {
		try {
			SpoutConfig kc = new SpoutConfig(new ZkHosts("node1"), "test", "/test", "id");
			kc.scheme = new SchemeAsMultiScheme(new StringScheme());
			kc.zkServers = ImmutableList.of("node1");
			kc.zkPort = 2181;
			// kafkaConfig.forceFromStart = true;

			TopologyBuilder builder = new TopologyBuilder();
			builder.setSpout("spoot", new KafkaSpout(kc), 2);
			builder.setBolt("check", new CheckBolt(), 1).shuffleGrouping("spoot");
			builder.setBolt("translate", new TranslateBolt(), 1).shuffleGrouping("check");
			builder.setBolt("save", new OrderBolt(), 1).shuffleGrouping("translate");

			Config config = new Config();
			config.setDebug(true);

			// 集群模式
			if (args != null && args.length > 1) {
				config.setNumWorkers(2);
				StormSubmitter.submitTopology(args[0], config, builder.createTopology());
			} else {
				// 本地模式
				config.setNumWorkers(2);
				LocalCluster cluster = new LocalCluster();
				cluster.submitTopology("topology-example1", config, builder.createTopology());
				Thread.sleep(500000);
				cluster.shutdown();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

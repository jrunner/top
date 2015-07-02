package com.t2t.top.storm.topology;

import com.t2t.top.storm.bolt.CounterBolt;
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

/**
 * wordcount示例
 * 
 * @author ypf
 */
public class CountTopology {
	public static void main(String[] args) {
		try {
			SpoutConfig kc = new SpoutConfig(new ZkHosts("node1"), "doword", "/doword", "id");
			kc.scheme = new SchemeAsMultiScheme(new StringScheme());
			kc.zkServers = ImmutableList.of("node1");
			kc.zkPort = 2181;
			// kafkaConfig.forceFromStart = true;

			TopologyBuilder builder = new TopologyBuilder();
			builder.setSpout("words", new KafkaSpout(kc), 2);
			builder.setBolt("counter", new CounterBolt()).shuffleGrouping("words");

			Config config = new Config();
			config.setDebug(true);
			config.put(Config.TOPOLOGY_TRIDENT_BATCH_EMIT_INTERVAL_MILLIS, 20000);

			// args = new String[] { "", "ypf", "node1" };
			// 集群模式
			if (args != null && args.length > 1) {
				config.setNumWorkers(2);
				StormSubmitter.submitTopology(args[0], config, builder.createTopology());
			} else {
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

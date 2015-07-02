package com.t2t.top.storm.topology;

import java.util.Arrays;

import storm.kafka.KafkaSpout;
import storm.kafka.SpoutConfig;
import storm.kafka.StringScheme;
import storm.kafka.ZkHosts;
import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.StormSubmitter;
import backtype.storm.generated.AlreadyAliveException;
import backtype.storm.generated.InvalidTopologyException;
import backtype.storm.generated.StormTopology;
import backtype.storm.spout.SchemeAsMultiScheme;
import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.TopologyBuilder;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Tuple;

import com.google.common.collect.ImmutableList;

/**
 * Hello world!
 * 
 */
public class KafkaSpoutTestTopology {

	public static class CounterBolt extends BaseBasicBolt {
		@Override
		public void declareOutputFields(OutputFieldsDeclarer declarer) {
		}

		@Override
		public void execute(Tuple tuple, BasicOutputCollector collector) {
		}

	}

	public static void main(String[] args) throws AlreadyAliveException, InvalidTopologyException {
		ZkHosts hosts = new ZkHosts("node1");
		SpoutConfig kafkaConfig = new SpoutConfig(hosts, "order", "/order", "id");
		kafkaConfig.scheme = new SchemeAsMultiScheme(new StringScheme());
		kafkaConfig.zkServers = ImmutableList.of("node1");
		kafkaConfig.zkPort = 2181;
		// kafkaConfig.forceFromStart = true;

		TopologyBuilder builder = new TopologyBuilder();
		builder.setSpout("spout", new KafkaSpout(kafkaConfig), 2);
		builder.setBolt("counter", new CounterBolt()).shuffleGrouping("spout");

		Config config = new Config();
		config.put(Config.TOPOLOGY_TRIDENT_BATCH_EMIT_INTERVAL_MILLIS, 2000);

		StormTopology stormTopology = builder.createTopology();
		if (args != null && args.length > 1) {
			String name = args[1];
			String dockerIp = args[2];
			config.setNumWorkers(2);
			config.setMaxTaskParallelism(5);
			config.put(Config.NIMBUS_HOST, dockerIp);
			config.put(Config.NIMBUS_THRIFT_PORT, 6627);
			config.put(Config.STORM_ZOOKEEPER_PORT, 2181);
			config.put(Config.STORM_ZOOKEEPER_SERVERS, Arrays.asList(dockerIp));
			StormSubmitter.submitTopology(name, config, stormTopology);
		} else {
			config.setNumWorkers(2);
			config.setMaxTaskParallelism(2);
			LocalCluster cluster = new LocalCluster();
			cluster.submitTopology("kafka", config, stormTopology);
		}
	}
}

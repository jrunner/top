package com.t2t.top.storm.bolt;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;

/**
 * 
 * @author ypf
 * 
 *         <pre>
 * declare:声明
 * tuple：重复
 * </pre>
 */
public class CounterBolt extends BaseBasicBolt {

	private static final long serialVersionUID = -806260187113123261L;
	private static long counter = 0;

	Map<String, Integer> counts = new java.util.HashMap<String, Integer>();

	@Override
	public void execute(Tuple input, BasicOutputCollector collector) {
		System.out.println("counter " + input.getString(0) + "\t counter:" + (counter++));

		String data = input.getString(0);
		data.replaceAll("\t", " "); // 当遇到Tab分割的，就直接转换为空隔
		data = data.replaceAll("\\s+", " "); // 以空格分割的,都转换为一个空格分割
		String[] values = data.split(" ");

		for (String word : values) {
			Integer c = counts.get(word);
			if (c == null) {
				c = 1;
			} else {
				c = c + 1;
			}
			counts.put(word, c);
		}
		System.out.println("counts:" + counts);

	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("words"));
	}

	public static void main(String[] args) {
		String str = "a b a		c";
		Pattern p = Pattern.compile("\\s*|\t");
		System.out.println("before:" + str);
		Matcher m = p.matcher(str);
		String after = m.replaceAll("-");
		System.out.println(after);
		System.out.println(str.split(p.pattern()).length);

		String data = str;
		data = data.replaceAll("\t", " "); // 当遇到Tab分割的，就直接转换为空隔
		data = data.replaceAll("\\s+", " "); // 以空格分割的,都转换为一个空格分割
		System.out.println(data);
		String[] aaa = data.split(" ");
		System.out.println(aaa.length);

	}
}

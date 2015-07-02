package com.t2t.top.storm.bolt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import backtype.storm.task.TopologyContext;
import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;

/**
 * 
 * @author ypf 入库
 * 
 */
public class OrderBolt extends BaseBasicBolt {
	private static boolean isOpen = true;
	private static Map<String, String> memberMap = null; // sendpay,counterMember
	private static final long serialVersionUID = -806260187113123261L;
	private static List<String> cacheList = null;

	@Override
	public void execute(Tuple input, BasicOutputCollector collector) {
		List<Object> list = input.getValues();

		String id = (String) list.get(0);
		String memberid = (String) list.get(1);
		String totalprice = (String) list.get(2);
		String youhui = (String) list.get(3);
		String sendpay = (String) list.get(4);
		String createdate = (String) list.get(5);

		saveCounterMember(memberid, sendpay, totalprice, youhui, createdate);// 记录独立用户数

	}

	private void saveCounterMember(String memberid, String sendpay, String totalprice, String youhui, String createdate) {
		// Jedis jedis = new Jedis("192.168.72.31")
		// String v = jedis.hget("orders", sendpay);

		// boolean isHasMem = StringUtils.isNotEmpty(v);

		saveMap(sendpay, false, totalprice, youhui, createdate);
	}

	public static void main(String[] args) {
		OrderBolt bolt = new OrderBolt();
		bolt.prepare(null, null);
		bolt.saveMap("2", false, "11", "1", "2014-08-10");
		bolt.saveMap("2", false, "11", "1", "2014-08-10");
		bolt.saveMap("2", false, "11", "1", "2014-08-10");
		bolt.saveMap("2", false, "11", "1", "2014-08-10");
		bolt.saveMap("1", false, "11", "1", "2014-08-10");
		bolt.saveMap("0", false, "12", "1", "2014-08-10");
		bolt.saveMap("0", false, "12", "2", "2014-08-10");
		System.out.println(memberMap);
	}

	private void saveMap(String sendpay, boolean isHasMem, String totalprice, String youhui, String createdate) {
		int id_num = 0;
		double tp = 0;
		double etp = 0;
		int counter_member = 0;
		String value = "";
		if (isOpen) {
			/**
			 * <pre>
			 * value = count(id),sum(totalPrice),sum(totalPrice - youhui),count(distinct memberid)
			 * </pre>
			 */
			value = memberMap.get(sendpay);
			if (value != null) {
				String[] vals = value.split(",");
				id_num = Integer.valueOf(vals[0]) + 1;
				tp = Double.valueOf(vals[1]) + Double.valueOf(totalprice);
				etp = Double.valueOf(vals[2]) + (Double.valueOf(totalprice) - Double.valueOf(youhui));
				counter_member = Integer.valueOf(vals[3]) + (isHasMem ? 0 : 1);
				value = getValue(id_num, tp, etp, counter_member, createdate);
			} else {
				id_num = 1;
				tp = Double.valueOf(totalprice);
				etp = (Double.valueOf(totalprice) - Double.valueOf(youhui));
				counter_member = (isHasMem ? 0 : 1);
			}
			value = getValue(id_num, tp, etp, counter_member, createdate);
			memberMap.put(sendpay, value);
		} else {
			id_num = 1;
			tp = Double.valueOf(totalprice);
			etp = (Double.valueOf(totalprice) - Double.valueOf(youhui));
			counter_member = (isHasMem ? 0 : 1);
			value = getValue(id_num, tp, etp, counter_member, createdate);
			cacheList.add(value);
		}

		System.out.println(value);

	}

	public String getValue(int num, double tp, double etp, int counter_member, String createdate) {
		String value = num + "," + tp + "," + etp + "," + counter_member + "," + createdate;
		return value;
	}

	@Override
	public void prepare(Map stormConf, TopologyContext context) {
		memberMap = new HashMap<String, String>();

		cacheList = new ArrayList<String>();
		isOpen = true;

	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("id", "memberid", "totalprice", "youhui", "sendpay", "createdate"));

	}
}

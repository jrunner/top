package com.t2t.top.storm.bolt;

import org.apache.commons.lang.StringUtils;

import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import com.t2t.top.storm.utils.Functions;

/**
 * 
 * @author yangpengfei
 * 
 *         <pre>
 * declare:声明
 * tuple：重复
 * emit:发送
 * 
 * 订单号	用户id		原金额		优惠价	标识字段	下单时间
 * id	memberid	totalprice	youhui	sendpay		createdate
 * </pre>
 */
public class CheckBolt extends BaseBasicBolt {

	private static final long serialVersionUID = -806260187113123261L;
	private static long counter = 0;

	@Override
	public void execute(Tuple tuple, BasicOutputCollector collector) {
		String line = tuple.getString(0);
		String[] values = check(line);
		collector.emit(new Values(values));

	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("id", "memberid", "totalprice", "youhui", "sendpay", "createtime"));
	}

	public static void main(String[] args) {

		String data = "4264782	41157	331	42	2	2014-04-20";
		CheckBolt bolt = new CheckBolt();

		String[] values = bolt.check(data);
		if (values != null) {
			System.out.println(values[1]);
		}
	}

	public String[] check(String line) {

		if (line == null || line.trim().length() == 0) {
			return null;
		}

		String[] values = line.split("\t");
		if (values.length != 6) {
			System.out.println("数据错误 values.length:" + values.length);
			return null;
		}

		String id = values[0];
		String memberid = values[1];
		String totalprice = values[2];
		String youhui = values[3];
		String sendpay = values[4];
		String createdate = values[5];

		if (StringUtils.isEmpty(id) || StringUtils.isEmpty(memberid) || StringUtils.isEmpty(totalprice) || !Functions.isDate(createdate, "2014-04-19")) {
			System.out.println("数据错误 ！");
			return null;
		}

		return values;
	}
}

package com.t2t.top.storm.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import redis.clients.jedis.Jedis;

import com.google.gson.Gson;

public class RedisDB {
	public static Gson gson = new Gson();
	public Jedis jedis = null;

	public RedisDB(Jedis jedis) {
		this.jedis = jedis;
	}

	/**
	 * 从内存中获取ip相关信息
	 */
	public void process(Long ip, Map map) {

	}

	public static Object unjson(String json, Class z) {
		return gson.fromJson(json, z);
	}

	public static void main(String[] args) throws Exception {

		Jedis jedis = new Jedis("192.168.72.31");
		String kk = "orders";
		if (jedis.exists(kk.getBytes()))
			jedis.del(kk);

		long s = new Date().getTime();

		Map map = new HashMap();
		map.put("1", "1,2,4");
		jedis.hmset(kk, map);

		System.out.println(jedis.hget(kk, "1"));

		long e = new Date().getTime();
		System.out.println((e - s) + "毫秒");
		System.out.println("ok1");
	}

}

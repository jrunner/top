package com.t2t.top.storm.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Functions {
	public static final String C_DATE_PATTON_DEFAULT = "yyyy-MM-dd";

	public static boolean isDate(String createDate, String startDate) {
		try {
			SimpleDateFormat format = new SimpleDateFormat(C_DATE_PATTON_DEFAULT);
			Date cdate = format.parse(createDate);
			Date sdate = format.parse(startDate);

			if (cdate.getTime() >= sdate.getTime()) {
				return true;
			} else {
				return false;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}
}

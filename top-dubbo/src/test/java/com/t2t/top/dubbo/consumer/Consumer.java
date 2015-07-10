package com.t2t.top.dubbo.consumer;

/**
 * Created by yangpengfei on 2015/7/8.
 */

import com.t2t.top.dubbo.DemoService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Consumer {

    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[]{"dubbo-consumer.xml"});
        context.start();

        DemoService demoService = (DemoService) context.getBean("demoService"); // 获取远程服务代理
        String hello = demoService.sayHello("yangpengfei"); // 执行远程方法

        System.out.println(hello); // 显示调用结果

        System.out.println(demoService.getLength("taobao"));
    }

}
package com.t2t.top.dubbo;

public class DemoServiceImpl implements DemoService {

    @Override
    public int getLength(String name) {
        if (name == null) {
            return -1;
        }
        return name.length();
    }

    public String sayHello(String name) {
        return "Hello " + name;
    }

}  
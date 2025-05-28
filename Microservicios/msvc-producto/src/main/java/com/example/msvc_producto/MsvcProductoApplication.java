package com.example.msvc_producto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class MsvcProductoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsvcProductoApplication.class, args);
	}
}
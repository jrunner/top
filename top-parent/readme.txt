1. 2014-06-20(周五)，构建tss-parent工程.
如果项目采用 maven 格式，默认是没有 IDE 所需要的配置文件。手动生成 Eclipse 与 MyEclipse 配置的指令是：
2. 2014-06-26(周四)，添加bat脚本，方便构建


说明：
Eclipse:
mvn eclipse:clean eclipse:eclipse -DdownloadSources 
MyEclipse:
mvn eclipse:myeclipse-clean eclipse:myeclipse -DdownloadSources

1. 如果发现没有kettle包，可用双肩%HOME%/bat/install.bat文件，作用将包自动安装到本地仓库中.
2. 公司的maven仓库暂时没有的jar包:
<dependency>
	<groupId>org.apache.httpcomponents</groupId>
	<artifactId>httpmime</artifactId>
	<version>4.3</version>
</dependency>





mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-core -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-core.jar
mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-db -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-db.jar
mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-dbdialog -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-dbdialog.jar
mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-engine -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-engine.jar
mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-ui-swt -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-ui-swt.jar
mvn install:install-file -DgroupId=org.pentaho.kettle -DartifactId=kettle-vfs -Dversion=4.2.0 -Dpackaging=jar -Dfile=%now%lib\kettle-vfs-20100924.jar
mvn install:install-file -DgroupId=org.apache.httpcomponents -DartifactId=httpmime -Dversion=4.3 -Dpackaging=jar -Dfile=%now%lib\httpmime-4.3.jar
mvn install:install-file -DgroupId=moql -DartifactId=moql -Dversion=1.0.5 -Dpackaging=jar -Dfile=%now%lib\moql-1.0.5.jar
mvn install:install-file -DgroupId=com.topsec.tss -DartifactId=tss-datafactory -Dversion=0.0.1-SNAPSHOT -Dpackaging=jar -Dfile=%now%lib\tss-datafactory-0.0.1-SNAPSHOT.jar
mvn install:install-file -DgroupId=com.topsec.tss -DartifactId=tss-velocity -Dversion=0.0.1-SNAPSHOT -Dpackaging=jar -Dfile=%now%lib\tss-velocity-0.0.1-SNAPSHOT.jar
mvn install:install-file -DgroupId=org.apache.phoenix -DartifactId=phoenix-client -Dversion=4.0.0-incubating -Dpackaging=jar -Dfile=%now%lib\phoenix-4.0.0-incubating-client.jar
plugins {
    id("java")
    id("war")
}

group = "m4shustik"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // ТОЛЬКО compileOnly для jakarta
    compileOnly("jakarta.faces:jakarta.faces-api:3.0.0")
    compileOnly("jakarta.persistence:jakarta.persistence-api:3.0.0")
    compileOnly("jakarta.enterprise:jakarta.enterprise.cdi-api:3.0.0")
    compileOnly("jakarta.servlet:jakarta.servlet-api:5.0.0")


    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<War> {
    archiveFileName.set("area-checker.war")
}
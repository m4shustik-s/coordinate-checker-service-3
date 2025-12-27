plugins {
    java
    war
}

group = "m4shustik"
version = "1.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

configurations.all {
    // ⚠️ Убираем конфликты версий
    resolutionStrategy {
        failOnVersionConflict()
        preferProjectModules()
    }
}

dependencies {
    // 1. CDI аннотации
    implementation("jakarta.enterprise:jakarta.enterprise.cdi-api:4.0.1")
    implementation("jakarta.inject:jakarta.inject-api:2.0.1")
    implementation("jakarta.annotation:jakarta.annotation-api:2.1.1")

    // 2. JSF API
    implementation("jakarta.faces:jakarta.faces-api:3.0.0")

    // 3. JPA API
    implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")

    // 4. EclipseLink
    implementation("org.eclipse.persistence:org.eclipse.persistence.jpa:4.0.3") {
        // ⚠️ Исключаем дубликаты из EclipseLink
        exclude(group = "jakarta.enterprise", module = "jakarta.enterprise.cdi-api")
        exclude(group = "jakarta.inject", module = "jakarta.inject-api")
        exclude(group = "jakarta.annotation", module = "jakarta.annotation-api")
    }

    // 6. Сервлеты
    implementation("jakarta.servlet:jakarta.servlet-api:6.0.0")

    // 7. EL для JSF
    implementation("jakarta.el:jakarta.el-api:5.0.0")

    implementation("jakarta.transaction:jakarta.transaction-api:2.0.1")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(listOf("-parameters"))
}

tasks.withType<War> {
    archiveFileName.set("ROOT.war")

    duplicatesStrategy = DuplicatesStrategy.EXCLUDE  // ✅ Решает проблему дублей!

    from(configurations.runtimeClasspath) {
        into("WEB-INF/lib")
        // Можно добавить фильтрацию если нужно
        // exclude("**/*-sources.jar", "**/*-javadoc.jar")
    }

    // ⚠️ Удаляем дубликаты META-INF если есть
    exclude("META-INF/*.SF", "META-INF/*.DSA", "META-INF/*.RSA")
}

tasks.register<Copy>("deploy") {
    dependsOn("war")
    from(tasks.war)
    into("${System.getProperty("user.home")}/weblr3/wildfly/standalone/deployments")

    doLast {
        println("✅ WAR развернут в WildFly")
    }
}

tasks.named("build") {
    finalizedBy("deploy")
}

// ⚠️ Очистка перед сборкой
tasks.register("cleanAll") {
    dependsOn("clean")
    doLast {
        delete("build", ".gradle")
        println("🗑️  Полная очистка")
    }
}

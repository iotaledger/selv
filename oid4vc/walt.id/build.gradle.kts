import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

object Versions {
    const val KOTLIN_VERSION = "1.9.22" // also change 2 plugins
    const val KTOR_VERSION = "2.3.8" // also change 1 plugin
    const val COROUTINES_VERSION = "1.8.0"
    const val EXPOSED_VERSION = "0.43.0"
    const val HOPLITE_VERSION = "2.8.0.RC3"
}

plugins {
    kotlin("jvm") version "1.9.0"
    application
}
group = "org.selv"
version = "0.1"
repositories {
    mavenCentral()
    maven("https://jitpack.io")
    maven("https://maven.walt.id/repository/waltid/")
}
dependencies {
    testImplementation(kotlin("test"))
    implementation("id.walt:waltid-openid4vc:1.0.2401111549-SNAPSHOT")
    implementation("id.walt:waltid-issuer-api:1.0.2401111549-SNAPSHOT")

      /* -- KTOR -- */

    // Ktor server
    implementation("io.ktor:ktor-server-core-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-auth-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-sessions-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-auto-head-response-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-double-receive-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-host-common-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-status-pages-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-compression-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-cors-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-forwarded-header-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-call-logging-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-call-id-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-server-cio-jvm:${Versions.KTOR_VERSION}")

    // Ktor client
    implementation("io.ktor:ktor-client-core-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-client-serialization-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-client-content-negotiation:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-client-json-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-client-cio-jvm:${Versions.KTOR_VERSION}")
    implementation("io.ktor:ktor-client-logging-jvm:${Versions.KTOR_VERSION}")


    /* -- Kotlin -- */

    // Kotlinx.serialization
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:${Versions.KTOR_VERSION}")

    // Date
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${Versions.COROUTINES_VERSION}")

}
tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(8)
}
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}
tasks.withType<Jar> {
    manifest {
        attributes["Main-Class"] = "oid4vc.MainKt"
    }
}
application {
    mainClass.set("oid4vc.MainKt")
}

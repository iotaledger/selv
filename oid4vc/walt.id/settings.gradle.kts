pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}

buildCache {
    local {
        enabled = false
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.7.0"
}
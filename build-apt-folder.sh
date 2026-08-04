#!/bin/bash
mkdir -p apt/usr/local/bin
mkdir -p apt/etc/systemd/system
cp wgmd/target/aarch64-unknown-linux-gnu/release/wgmd apt/usr/local/bin/wgmd
cp wgm apt/usr/local/bin/wgm
cp service/wgm.service apt/etc/systemd/system/wgm.service
cp service/wgmd.service apt/etc/systemd/system/wgmd.service
#Simple script to toggle a key "featureFlag" on redis server specificed by REDIS_IP in config file

import redis;
import json;

with open('./config.json') as config_file:
    config = json.load(config_file);
r = redis.StrictRedis(host=config["REDIS_IP"], port=6379, db=0);

featureFlag = r.get("featureFlag");
if featureFlag != "None":
    if featureFlag == "on":
        r.set("featureFlag", "off");
    else:
        r.set("featureFlag", "on");
else:
    r.set("featureFlag", "on");

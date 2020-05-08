try:
    # uses the config from this folder for the general setup
    import config
except:
    # we run the testcase / other
    pass

import os
import shutil
import pysolr
from pathlib import Path
from urlpath import URL
import json


def get_default_config_dir(solr_home: Path):
    return solr_home / "configsets" / "_default" / "conf"


def get_solr_home():
    try:
        solr_home = Path(os.environ["SOLR_HOME"])
    except:
        raise ValueError(
            "You have not set the SOLR_HOME environment variable!\n"
            "export SOLR_HOME='SOLR_ROOT/server/solr'"
        )

    return solr_home


def print_status(result: dict, corename: str):
    if result["responseHeader"]["status"] == 0:
        print(f"Core with name '{corename}' created.")
    else:  # we are maybe good (core exists), or error
        print(result["error"]["msg"])


def create_admin(url: URL):
    admin_url = url / "admin" / "cores"
    admin = pysolr.SolrCoreAdmin(admin_url)
    return admin


def create_core(config: dict):
    corename = config["corename"]
    solr_home = get_solr_home()
    default_dir = get_default_config_dir(solr_home)
    working_dir = solr_home / corename
    try:
        shutil.copytree(default_dir, working_dir)
    except FileExistsError:
        # the core has already been created once,
        # we don't bother and use the old config
        pass

    base_url = URL(config["url"])
    admin = create_admin(base_url)

    # create a core with default configuration
    res = admin.create(corename, working_dir)
    res = json.loads(res)

    print_status(res, corename)


if __name__ == "__main__":
    create_core(config.tag_storage)

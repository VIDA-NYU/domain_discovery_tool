# This is hopefully a temporary fix for the recent changes to npm
# that breaks with the error "Module not found: Error: Cannot
# resolve module 'child_process'"

import json

with open("node_modules/xmlhttprequest/package.json") as f:
    package_json = json.load(f)

package_json["browser"] = {"child_process": False}

with open("node_modules/xmlhttprequest/package.json", "w") as f:
    json.dump(package_json, f, indent=2)



type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  // USER //
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  // POSTS //
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // LOCATION //
  {
    name: "Get Locations (empty for all)",
    endpoint: "/api/locations",
    method: "GET",
    fields: {},
  },
  {
    name: "Create Location",
    endpoint: "/api/locations",
    method: "POST",
    fields: { street: "input", city: "input", state: "input", country: "input", zip_code: "input" },
  },
  {
    name: "Get Locations In Zip Code",
    endpoint: "/api/locations/:zip_code",
    method: "GET",
    fields: { zip_code: "input" },
  },
  {
    name: "Delete Location",
    endpoint: "/api/locations/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // ACTIVITIES //
  {
    name: "Get Activities (empty for all)",
    endpoint: "/api/activities",
    method: "GET",
    fields: {},
  },
  {
    name: "Search for an Activity By Name",
    endpoint: "/api/activities/:name",
    method: "GET",
    fields: { name: "input" },
  },
  // {
  //   name: "Get Activities Logged In User is a Member Of",
  //   endpoint: "/api/activities/members",
  //   method: "GET",
  //   fields: {},
  // },
  // {
  //   name: "Get Activities a User is a Member Of",
  //   endpoint: "/api/activities/members/:username",
  //   method: "GET",
  //   fields: { username: "input" },
  // },
  {
    name: "Search for an Activity By Id",
    endpoint: "/api/activities/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Create Activity",
    endpoint: "/api/activities",
    method: "POST",
    fields: { name: "input", join_code: "input" },
  },
  {
    name: "Join an Activity",
    endpoint: "/api/activities/join/:name",
    method: "PATCH",
    fields: { name: "input", join_code: "input" },
  },
  {
    name: "Promote User in an Activity",
    endpoint: "/api/activities/promote/:username",
    method: "PATCH",
    fields: { activity_name: "input", username: "input" },
  },
  {
    name: "Demote a Manager in an Activity",
    endpoint: "/api/activities/demote/:username",
    method: "PATCH",
    fields: { activity_name: "input", username: "input" },
  },
  {
    name: "Kick a User from an Activity",
    endpoint: "/api/activities/kick/:username",
    method: "PATCH",
    fields: { activity_name: "input", username_to_kick: "input" },
  },
  {
    name: "Leave an Activity",
    endpoint: "/api/activities/leave/:activity_name",
    method: "PATCH",
    fields: { activity_name: "input" },
  },
  {
    name: "Delete Activity",
    endpoint: "/api/activities/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // CARPOOLS //
  {
    name: "Get Carpools (empty for all)",
    endpoint: "/api/carpools",
    method: "GET",
    fields: {},
  },
  {
    name: "Search for a Carpool By Name",
    endpoint: "/api/carpools/:name",
    method: "GET",
    fields: { name: "input" },
  },
  {
    name: "Search for a Carpool By Target Id",
    endpoint: "/api/carpools/:target_id",
    method: "GET",
    fields: { target_id: "input" },
  },
  {
    name: "Search for a Carpool By Target Name",
    endpoint: "/api/carpools/:target_name",
    method: "GET",
    fields: { target_name: "input" },
  },
  {
    name: "Search for a Carpool By Id",
    endpoint: "/api/carpools/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Create Carpool",
    endpoint: "/api/carpools",
    method: "POST",
    fields: { name: "input", target: "input" },
  },
  {
    name: "Join a Carpool",
    endpoint: "/api/carpools/join/:name",
    method: "PATCH",
    fields: { name: "input" },
  },
  // {
  //   name: "Promote User to Driver in a Carpool",
  //   endpoint: "/api/carpools/promote/:username",
  //   method: "PATCH",
  //   fields: { carpool_name: "input", username: "input" },
  // },
  // {
  //   name: "Demote a Driver in a Carpool",
  //   endpoint: "/api/carpools/demote/:username",
  //   method: "PATCH",
  //   fields: { carpool_name: "input", username: "input" },
  // },
  // {
  //   name: "Kick a User from a Carpool",
  //   endpoint: "/api/carpools/kick/:username",
  //   method: "PATCH",
  //   fields: { carpool_name: "input", username: "input" },
  // },
  // {
  //   name: "Leave a Carpool",
  //   endpoint: "/api/carpools/leave/carpool_name",
  //   method: "PATCH",
  //   fields: { carpool_name: "input" },
  // },
  {
    name: "Delete Carpool",
    endpoint: "/api/carpools/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  // COMMENTS //
  {
    name: "Get Comments (empty for all)",
    endpoint: "/api/comments",
    method: "GET",
    fields: {},
  },
  {
    name: "Create Comment",
    endpoint: "/api/comments",
    method: "POST",
    fields: { content: "input", target: "input", root: "input" },
  },
  {
    name: "Search for Comments By Target (what the Comment is directly nested beneath)",
    endpoint: "/api/comments/:target",
    method: "GET",
    fields: { target: "input" },
  },
  {
    name: "Search for Comments By Root (the original Post or object the comment tree is built from)",
    endpoint: "/api/comments/:root",
    method: "GET",
    fields: { root: "input" },
  },
  {
    name: "Delete Comment",
    endpoint: "/api/comments/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});

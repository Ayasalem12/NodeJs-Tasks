const fs = require("fs");
//  function readFile
function readFile(filename, callback) {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

//  function writeFile
function writeFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File written successfully");
    }
  });
}

// Args
function getArguments() {
  let args = process.argv.slice(2);
  let command = args[0];
  let title, status, id;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "-t") {
      title = args[++i];
    } else if (args[i] === "-s" || args[i] === "--status") {
      status = args[++i];
    } else if (args[i] === "--id") {
      id = args[++i];
    }
  }
  return { command, title, status, id };
}

/*******************************************************************/

let file_name = "data.json";
let status_validaton = ["to-do", "in_progress", "done"];
let { command, title, status, id } = getArguments();

if (command === "list") {
  readFile(file_name, (to_do_list) => {
    if (!status) {
      console.log(to_do_list);
    } else {
      if (status && !status_validaton.includes(status)) {
        console.log(
          `Invalid status, it must be on of : ${status_validaton.join(", ")}`
        );
      } else {
        to_do_list = to_do_list.filter((to_do) => to_do.status == status);
        console.log(to_do_list);
      }
    }
  });
} else if (command === "add") {
  readFile(file_name, (to_do_list) => {
    // console.log(typeof(to_do_list))
    let id =
      to_do_list.length === 0 ? 1 : to_do_list[to_do_list.length - 1].id + 1;
    if (status && !status_validaton.includes(status)) {
      console.log(
        `Invalid status, it must be on of : ${status_validaton.join(", ")}`
      );
    } else {
      let new_to_do = { title: title, id: id, status: status };
      to_do_list.push(new_to_do);
      writeFile(file_name, to_do_list);
    }
  });
} else if (command === "delete") {
  readFile(file_name, (to_do_list) => {
    let check_id_index = to_do_list.findIndex((to_do) => to_do.id == id);
    //    console.log(check_id_index)
    if (check_id_index !== -1) {
      to_do_list[check_id_index].status = status;
      writeFile(file_name, to_do_list);
      console.log("Delete Successfully!");
      // to_do_list.splice(check_id_index,1)
    } else {
      console.log("ID not found");
    }
  });
} else if (command === "update") {
  readFile(file_name, (to_do_list) => {
    if (!status && !title) {
      console.log("Should update title or status or both!");
    } else {
      let check_id_index = to_do_list.findIndex((to_do) => to_do.id == id);
      if (check_id_index !== -1) {
        if (!status && !title) {
          console.log("Should update title or status or both!");
        } else {
          if (status && !status_validaton.includes(status)) {
            console.log(
              `Invalid status, it must be on of : ${status_validaton.join(
                ", "
              )}`
            );
          } else {
            to_do_list[check_id_index].status = status;
            to_do_list[check_id_index].title = title;
            // to_do_list[check_id_index].title=title
            // console.log(to_do_list[check_id_index].title)
            writeFile(file_name, to_do_list);
            console.log("Update Successfully!");
          }
        }
      } else {
        console.log("ID not found");
      }
    }
  });
}

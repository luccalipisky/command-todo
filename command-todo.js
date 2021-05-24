$(document).ready(function () {
  $(".prompt-input").focus();
  $(".prompt-input").on("input", function () {
    clearPromptFeedback();
  });
  showOrRemoveHint();
});

function getPromptText(p) {
  p = p.split(" ").slice(1).join(" ");
  return p;
}

function underscoredName(n) {
  return n.replace(/ /g, "_");
}

function clearPromptFeedback() {
  if ($(".prompt-input").val()) {
    $("#prompt-feedback").text("");
  }
}

function showOrRemoveHint() {
  if ($("#tasks-list").html()) {
    $("#help-hint").hide();
    $("#tasks-summary").show();
  } else {
    $("#help-hint").show();
    $("#tasks-summary").hide();
  }
  updateTasksSummary();
}

function updateTasksSummary() {
  let pending_amount = tasks.filter((t) => t.status === "pending").length;
  let doing_amount = tasks.filter((t) => t.status === "doing").length;
  let done_amount = tasks.filter((t) => t.status === "done").length;
  $("#pending-counter").text(pending_amount);
  $("#doing-counter").text(doing_amount);
  $("#done-counter").text(done_amount);
  $("#project-done-counter").text(done_amount);
  $("#project-total-counter").text(tasks.length);
}

let tasks = [];
let id = 1;

function promptSubmit(e) {
  if (e.keyCode === 13) {
    let prompt_text = getPromptText(e.target.value);
    let prompt_action = e.target.value.split(" ")[0];
    switch (prompt_action) {
      case "new_project":
        newProject(prompt_text);
        showOrRemoveHint();
        break;
      case "add":
        addTask(prompt_text);
        showOrRemoveHint();
        break;
      case "edit":
        editTask(prompt_text);
        break;
      case "remove":
        removeTask(prompt_text);
        showOrRemoveHint();
        break;
      case "status":
        changeStatus(prompt_text);
        showOrRemoveHint();
        break;
      case "help":
        break;
      default:
        $("#prompt-feedback").text(
          "Command not found. Type 'help' to see available commands."
        );
    }
    $(e.target).val("");
    e.preventDefault();
  }
}

let statusIcons = {
  pending: { icon: "□", color: "" },
  doing: { icon: "◌", color: "#febc2e" },
  done: { icon: "✓", color: "#28c840" },
};

function renderTasks() {
  $("#tasks-list").html(
    tasks.map(
      (t) => `
      <p class="gray mt-1 font-light" id="task-${t.id}">
      ${t.id}. <span id="task-${t.id}-status" style='color: ${
        statusIcons[t.status].color
      }'>${statusIcons[t.status].icon}</span> <span id="task-desc">${
        t.description
      }</span>
      </p>
    `
    )
  );
}

function reArrangeTasks(arr) {
  for (var a in arr) {
    arr[a].id = parseInt(a) + 1;
  }
  return arr;
}

// Action methods

function newProject(text) {
  if (text.length > 0) {
    $("#project-name-container").html(`
    <span class="gray italic" id="project-name">@${underscoredName(text)}</span>
    <span class="light-gray" id="tasks-number">[<span id='project-done-counter'>0</span>/<span id='project-total-counter'>0</span>]</span>
    `);
  } else {
    $("#prompt-feedback").text(
      "'new_project' should be followed by the name of your project."
    );
  }
}

function addTask(text) {
  if ($("#project-name-container").html()) {
    tasks.push({
      id: id,
      description: text,
      status: "pending",
    });
    renderTasks();
    $("#project-name-container").find("#project-total-counter").text(id);
    id += 1;
  } else {
    $("#prompt-feedback").text(
      "You need to create a project using 'new_project' before adding tasks."
    );
  }
}

function editTask(text) {
  if ($("#project-name-container").html()) {
    let prompt_desc = getPromptText(text);
    let prompt_id = text.split(" ")[0];
    if ($(`p#task-${prompt_id}`).length) {
      if (prompt_desc) {
        let taskIndex = tasks.findIndex((t) => t.id === parseInt(prompt_id));
        tasks[taskIndex].description = prompt_desc;
        renderTasks();
      } else {
        $("#prompt-feedback").text(
          "You need to provide a new description for that task"
        );
      }
    } else {
      $("#prompt-feedback").text("Task does not exist.");
    }
  } else {
    $("#prompt-feedback").text("You need to create a project first.");
  }
}

function removeTask(text) {
  if ($("#project-name-container").html()) {
    let prompt_id = text.split(" ")[0];
    if ($(`p#task-${prompt_id}`).length) {
      tasks = tasks.filter((t) => t.id !== parseInt(prompt_id));
      tasks = reArrangeTasks(tasks);
      renderTasks();
      $("#project-name-container")
        .find("#project-total-counter")
        .text(tasks.length);
      id = tasks.length + 1;
    } else {
      $("#prompt-feedback").text("Task does not exist.");
    }
  } else {
    $("#prompt-feedback").text("You need to create a project first.");
  }
}

function changeStatus(text) {
  if ($("#project-name-container").html()) {
    let prompt_status = getPromptText(text);
    let prompt_id = text.split(" ")[0];
    if ($(`p#task-${prompt_id}`).length) {
      if (prompt_status) {
        let taskIndex = tasks.findIndex((t) => t.id === parseInt(prompt_id));
        switch (prompt_status) {
          case "pending":
            tasks[taskIndex].status = prompt_status;
            break;
          case "doing":
            tasks[taskIndex].status = prompt_status;
            break;
          case "done":
            tasks[taskIndex].status = prompt_status;
            break;
          default:
            $("#prompt-feedback").text(
              "Status needs to be 'pending', 'doing', or 'done'"
            );
        }
        renderTasks();
      } else {
        $("#prompt-feedback").text(
          "You need to provide a new description for that task"
        );
      }
    } else {
      $("#prompt-feedback").text("Task does not exist.");
    }
  } else {
    $("#prompt-feedback").text("You need to create a project first.");
  }
}

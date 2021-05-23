$(document).ready(function () {
  $(".prompt-input").focus();
  $(".prompt-input").on("input", function () {
    clearPromptFeedback();
  });
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

let id = 1;

function promptSubmit(e) {
  if (e.keyCode === 13) {
    let prompt_text = getPromptText(e.target.value);
    let prompt_action = e.target.value.split(" ")[0];
    switch (prompt_action) {
      case "new_project":
        newProject(prompt_text);
        break;
      case "add":
        addTask(prompt_text);
        break;
      case "edit":
        editTask(prompt_text);
        break;
      case "delete":
        deleteTask(prompt_text);
        break;
      case "status":
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

// Action methods

function newProject(text) {
  if (text.length > 0) {
    $("#project-name-container").html(`
    <span class="gray italic" id="project-name">@${underscoredName(text)}</span>
    <span class="light-gray" id="tasks-number">[<span id='done-counter'>0</span>/<span id='total-counter'>0</span>]</span>
    `);
  } else {
    $("#prompt-feedback").text(
      "'new_project' should be followed by the name of your project."
    );
  }
}

function addTask(text) {
  if ($("#project-name-container").html()) {
    $("#tasks-list").append(`
      <p class="gray mt-1 font-light" id="task-${id}">
      ${id}. <span id="task-${id}-status">□</span> <span id="task-desc">${text}</span>
      </p>
    `);
    $("#project-name-container").find("#total-counter").text(id);
    id += 1;
  } else {
    $("#prompt-feedback").text(
      "You need to create a project using 'new_project' before adding tasks."
    );
  }
}

function editTask(text) {
  if ($("#project-name-container").html()) {
    let prompt_name = getPromptText(text);
    let prompt_id = text.split(" ")[0];
    if ($(`p#task-${prompt_id}`).length) {
      if (prompt_name) {
        $(`p#task-${prompt_id}`).find("span#task-desc").text(prompt_name);
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

function deleteTask(text) {
  if ($("#project-name-container").html()) {
    let prompt_id = text.split(" ")[0];
    if ($(`p#task-${prompt_id}`).length) {
      // delete
    } else {
      $("#prompt-feedback").text("Task does not exist.");
    }
  } else {
    $("#prompt-feedback").text("You need to create a project first.");
  }
}

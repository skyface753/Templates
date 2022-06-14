import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", "src/views", "dist/" );
// Copy all the scripts
shell.cp( "-R", "src/scripts", "dist/" );

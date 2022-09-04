Python flask server for tournament site

## Initial setup
The following should be done in the `flask-server` directory.

### Windows (PowerShell)
1. Ensure python 3 is installed.
    1. Run `py` and ensure python version is at least 3. Python will need installed if not.
    2. CTRL+z and Enter to exit Python environment
2. Enable being able to enter python virtual environment with command `Set-ExecutionPolicy Unrestricted -Scope Process`
    1. I don't know what this does. Don't blame me if it lets you break something you shouldn't be able to break.
3. Create a python virtual environment with command `py -m venv venv`
4. Enter the virtual environment with command `venv\Scripts\activate`
5. Install requirements with `pip install -r requirements.txt`
    1. Note that the requirements will need reinstalled with this command whenever changed
    2. If you've added a package, run `pip freeze` to get a new list of dependencies and update `requirement.txt`

### MacOS/Linux (Terminal)
1. Ensure python 3 is installed.
    1. I'm not sure how. I can figure out if you need.
2. Create a python virtual environment with the command `python3 -m venv venv`
3. Enter virtual environment with command `. venv/bin/activate`
4. Install requirements with `pip install -r requirements.txt`
    1. Note that the requirements will need reinstalled with this command whenever changed
    2. If you've added a package, run `pip freeze` to get a new list of dependencies and update `requirement.txt`

## How to run Flask app

### Windows (PowerShell)

1. Enter virtual environment with command `venv\Scripts\activate`
2. Run the app with `flask run`

### MacOS/Linux (Terminal)

1. Enter virtual environment with command `. venv/bin/activate`
2. Run the app with `flask run`

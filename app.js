// it's good practice to group require statements by source: npm packages, personal modules and core library modules
const inquirer = require('inquirer');
const generatePage = require('./src/page-template.js');
// const generateSite = require('./utils/generate-site.js');
// the line below is equivalent to the line above but will ultimately be more efficient
const { writeFile, copyFile } = require('./utils/generate-site.js');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is your name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter your name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: "Enter your GitHub username. (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Your GitHub username is required.');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAbout',
            message: 'Would you like to enter information about yourself for an "About" section?',
            default: true
        },
        {
            type: 'input',
            name: 'about',
            message: 'Provide some information about yourself:',
            when: ({ confirmAbout }) => {
                if (confirmAbout) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);
};

// captures data returned from 'promptUser' function and calls itself recursively for as many projects as the user wants to add; each project is pushed into an array; the final array is returned to the next step asynchronously
const promptProject = portfolioData => {
    console.log(`
=================
Add a New Project
=================
`);
    // If this the the first project being entered, an array for holding 'project' data is created. Otherwise, added projects will be added to existing array property.
    if (!portfolioData.projects) {
        portfolioData.projects = [];
    }
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of your project? (Required)',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter the name of your project.');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Provide a description of the project (Required)',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter a project description.');
                        return false;
                    }
                }
            },
            {
                type: 'checkbox',
                name: 'languages',
                message: 'What did you build this project with? (Check all that apply)',
                choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Node']
            },
            {
                type: 'input',
                name: 'link',
                message: 'Enter the GitHub link to your project. (Required)',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('The project link is required.');
                        return false;
                    }
                }
            },
            {
                type: 'confirm',
                name: 'feature',
                message: "Would you like to feature this project?",
                default: false
            },
            {
                type: 'confirm',
                name: 'confirmAddProject',
                message: 'Would you like to enter another project?',
                default: false
            },
        ])
        // the newly added project data is pushed to the 'projectData' array and the final data set is returned to the 'promptUser' function as 'portfolioData'
        .then(projectData => {
            portfolioData.projects.push(projectData)
            if (projectData.confirmAddProject) {
                return promptProject(portfolioData);
            } else {
                return portfolioData;
            }
        });
};

// use the following while developing
const mockData = {
    name: 'Sara Krizan',
    github: 'SMKrizan',
    confirmAbout: true,
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada, tellus eget placerat ultrices.',
    projects: [
        {
            title: 'TallyMax',
            description: 'A 2-5 letter coupled word and image generator designed to build word-game prowess.',
            languages: ['JavaScript', 'HTML', 'CSS', 'jQuery'],
            link: 'https://jgrossh2.github.io/word-generator',
            feature: true,
            confirmAddProject: true
        },
        {
            title: 'WeatherView',
            description: 'Find the current weather conditions and 5-day forecast in a city of your choice.',
            languages: ['JavaScript', 'HTML', 'CSS'],
            link: 'https://SMKrizan.github.io/WeatherView',
            feature: true,
            confirmAddProject: true
        },
        {
            title: 'Run-Buddy',
            description: 'A webpage designed to offer personal-training services.',
            languages: ['HTML', 'CSS'],
            link: 'https://SMKrizan.github.io/run-buddy',
            feature: false,
            confirmAddProject: false
        }


    ]
};

const pageHTML = generatePage(mockData);

// promptUser is called to accept the new data array of projects
promptUser()
    .then(promptProject)
    // this function's output, 'portfolioData', is sent to the 'generatePage' function...
    .then(portfolioData => {
        return generatePage(portfolioData);
    })
    // ...which will return an HTML file, 'pageHTML', within which the HTML template code will be written.
    .then(pageHTML => {
        return writeFile(pageHTML);
    })
    // 'pageHTML' is then passed into the 'writeFile' function, which returns a Promise to the 'copyFile' function.
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    // the 'writeFileResponse' object provided by the execution of 'resolve()' within the 'writeFile' function is logged and returned to the 'copyFile' function which tells us whether the CSS file was copied successfully.
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });

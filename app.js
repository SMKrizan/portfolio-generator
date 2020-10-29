// it's good practice to group require statements by source: npm packages, personal modules and core library modules
const inquirer = require('inquirer');
const fs = require('fs');
const generatePage = require('./src/page-template.js');

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

const promptProject = portfolioData => {
    console.log(`
=================
Add a New Project
=================
`);
    // If there's no 'projects' array property, create one
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
        .then(projectData => {
            portfolioData.projects.push(projectData)
            if (projectData.confirmAddProject) {
                return promptProject(portfolioData);
            } else {
                return portfolioData;
            }
        });
};

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

// comment out the following 4 lines + final closure line in order to use dummy data
// promptUser()
//     .then(promptProject)
//     .then(portfolioData => {
        // const pageHTML = generatePage(portfolioData);

        fs.writeFile('./index.html', pageHTML, err => {
            if (err) throw new Error(err);

            console.log('Page created! Check out index.html in this directory to see it!')
        });
    // });

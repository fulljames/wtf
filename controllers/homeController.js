exports.index = function (req, res) {

    var data = {
        'contacts': {
            'links': [{
                'href': 'http://www.twitter.com/fulljames',
                'label': 'Twitter'
            },{
                'href': 'http://www.flickr.com/emptyjames',
                'label': 'Flickr'
            },{
                'href': 'http://instagrid.me/fulljames/',
                'label': 'Instagrid'
            },{
                'href': 'http://uk.linkedin.com/in/stephenfulljames',
                'label': 'Linked In'
            }]
        },
        'writing': {
            'title': 'Recent writing',
            'links': [{
                'href': 'http://red-badger.com/Blog/post/HTML5-prototyping-with-Node-and-Knockout.aspx',
                'label': 'HTML5 prototyping with Node and Knockout',
                'meta': '03 Jan 12 for Red Badger'
            },{
                'href': 'http://12412.org/2012/01/tools-and-technologies',
                'label': 'Tools and Technologies for 2012',
                'meta': '02 Jan 12 for 12412.org'
            },{
                'href': 'http://www.12devsofxmas.co.uk/2011/12/knockout-js/',
                'label': 'Learn the magic of client-side data binding with Knockout.js',
                'meta': '26 Dec 11 for 12 Devs of Xmas'
            }]
        },
        'projects': {
            'title': 'Projects',
            'items': [{
                'href': 'http://leagueofmeals.org/',
                'label': 'League of Meals',
                'tools': 'Slim, Perch, Knockout, LESS',
                'date': 'February 12',
                'description': 'Front end build and Perch integration for a new social enterprise startup from Sidekick Studios. The aim is to establish \'cook clubs\' for older people who want to stay active, and share the results with their communities.',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://www.sidekickstudios.net',
                    'label': 'Sidekick Studios'
                },{
                    'type': 'UX and Product Manager',
                    'href': 'http://johannakoll.posterous.com/',
                    'label': 'Johanna Kollmann'
                }]
            },{
                'href': 'http://12412.org/',
                'label': '12412',
                'tools': 'Wordpress',
                'date': 'January 12',
                'description': 'A collaborative learning project for 2012. The aim is to experience a new web technology every month through the year and blog about what we\'ve learned.                ',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://mrqwest.co.uk/',
                    'label': 'Anthony Killeen'
                },{
                    'type': 'Wordpress',
                    'href': 'http://pauladmdavis.com/',
                    'label': 'Paul Adam Davis'
                }]
            },{
                'href': 'http://www.thegoalrace.com/',
                'label': 'The Goal Race',
                'tools': 'Node, LESS, jQuery, Knockout',
                'date': 'November 11',
                'description': 'Front end and back end build for a football gaming concept. Created in two days during a Launch 48 prototyping event for a media client.'
            },{
                'href': 'http://secerna.co.uk',
                'label': 'Secerna',
                'tools': 'Perch, LESS, jQuery, Knockout, QUnit',
                'date': 'September 11',
                'description': 'Front end and back end build for a new firm of patent attorneys. The complex navigation interactions were created under a unit-testing process for speed and accuracy.',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://www.plan-bstudio.com/',
                    'label': 'Plan-B Studio'
                }]
            },{
                'href': 'http://www.imogenheap.com/heapsong2/claritycloud.php',
                'label': 'Clarity Cloud',
                'tools': 'PHP, jQuery',
                'date': 'June 11',
                'description': 'Front end and back end build on a crowd-sourced song writing project for Imogen Heap',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://www.imogenheap.com/',
                    'label': 'Imogen Heap'
                },{
                    'type': 'Integration',
                    'href': 'http://www.replenishnewmedia.com/',
                    'label': 'Replenish'
                }]
            },{
                'href': 'http://www.thesportcourt.co.uk/',
                'label': 'The Sport Court',
                'tools': 'PHP, LESS, jQuery, Raphael',
                'date': 'May 11',
                'description': 'Front end build for a sports debate event.',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://endjin.com/',
                    'label': 'Endjin'
                }]
            },{
                'href': 'http://putneyhill.co.uk',
                'label': 'Putney Hill',
                'tools': 'PHP, LESS, jQuery',
                'date': 'March 11',
                'description': 'Front end build and custom Javascript animation for a housing development in south west London.',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://www.welove72.com/',
                    'label': 'We Love'
                },{
                    'type': 'Development',
                    'href': 'http://pauladamdavis.com',
                    'label': 'Paul Adam Davis'
                },{
                    'type': 'Development',
                    'href': 'http://prettybigdeal.co.uk',
                    'label': 'Jonathan Andrew'
                }]
            },{
                'href': 'http://littlemusings.net/',
                'label': 'Little Musings',
                'tools': 'Perch',
                'date': 'January 11',
                'description': 'Collaborative design, front end build and Perch and e-junkie integration for a digital scrapbooking stamp shop'
            },{
                'href': 'http://www.unioncycleworks.org.uk/',
                'label': 'Union Cycle Works',
                'tools': 'EE',
                'date': 'September 10',
                'description': 'Front end build for a not-for-profit co-operative cycling project in the heart of Deptford, South-East London.',
                'credits': [{
                    'type': 'Design',
                    'href': 'http://www.jamescuddy.co.uk/',
                    'label': 'James Cuddy'
                },{
                    'type': 'UX and Expression Engine integration',
                    'href': 'http://www.choosenick.com',
                    'label': 'Nick Marsh'
                }]
            }]
        },
        'tools': {
            'title': 'Tools I Use',
            'items': [{
                'href': 'http://www.knockoutjs.com',
                'label': 'Knockout',
                'meta': 'Trending',
                'description': 'Javascript library for UI data binding using the Model-View-View Model pattern. Essential for rapid prototyping.'
            },{
                'href': 'http://www.lesscss.org',
                'label': 'LESS',
                'meta': 'Trending, used here',
                'description': 'CSS pre-compiler adding rich dynamic behaviour, allowing more structured stylesheets and functional operations.'
            },{
                'href': 'https://github.com/jquery/qunit',
                'label': 'QUnit',
                'meta': 'QUnit',
                'description': 'A powerful Javascript unit-testing framework. Don\'t start making a serious web app without it (or something like it).'
            },{
                'href': 'http://nodejs.org',
                'label': 'Node.js',
                'meta': 'Trending, used here',
                'description': 'Event-driven JavaScript server based on the V8 engine. Still getting to grips with this one but liking what I see.'
            },{
                'href': 'http://grabaperch.com',
                'label': 'Perch',
                'meta': 'Trending',
                'description': 'A brilliant little CMS that gives simple integration of powerful features into any HTML template.'
            },{
                'href': 'http://www.slimframework.com/',
                'label': 'Slim Framework',
                'meta': 'Trending',
                'description': 'At heart a straightforward Restful router framework for PHP, with some powerful features for quick and easy development.'
            }]
        }
    };

    res.render("home", { title: 'stephen fulljames', data: data });
};
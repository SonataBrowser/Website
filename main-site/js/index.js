document.addEventListener("DOMContentLoaded", async function (event) {
    
    let currentPageId = '';
    const MapPages = 
        {
            'home' : { fileName : 'home-body.html'  , callback : function() { InitializeTimer();} }
        ,   'about': { fileName : 'about-body.html' , callback : function() {} }
       }


    async function LoadPage(id, pushHistory) 
    {
        if (id == currentPageId)
          return; // Don't process request if on the same page.
        
        const content = await fetch(MapPages[id].fileName);

        document.getElementById("hero-body").innerHTML = await content.text();
        currentPageId = id;
        if (pushHistory)
            history.pushState( id , null, '#' + id);

         
        if (MapPages[id].callback != null)
            MapPages[id].callback();
    }

    window.onpopstate = function(event) 
    {
        const pageID = event.state;
        if (pageID == null)
        {
            history.back();
        }
        else
        {
            LoadPage(pageID, false);
        }
    };
      
    

    function InitializeTimer() {
        function getTimeRemaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function initializeClock(id, endtime) {
            var clock = document.getElementById(id);
            var daysSpan = clock.querySelector('.days');
            var hoursSpan = clock.querySelector('.hours');
            var minutesSpan = clock.querySelector('.minutes');
            var secondsSpan = clock.querySelector('.seconds');

            function updateClock() {
                var t = getTimeRemaining(endtime);
                daysSpan.innerHTML = t.days;
                hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

                if (t.total <= 0) {
                    clearInterval(timeinterval);
                }
            }

            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
        }

        //var st = srvTime();
        //var date = new Date(st);



        //var deadline = new Date(Date.parse(date) + 18 * 24 * 60 * 60 * 1000);
        var deadline = new Date('2020-01-01T00:00:00Z');
        //var deadline = new Date(Date.parse(new Date()) + 300 * 24 * 60 * 60 * 1000);
        initializeClock('clockdiv', deadline);
    }

    function HideMenu() {
        var burger = document.querySelector('.burger');
        var menu = document.querySelector('#' + burger.dataset.target);
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
    }


    //     Load initial page from hash Url
    let StartPage = 'home' // default to home

    if(window.location.hash) 
    {
        const hash = window.location.hash.substring(1);
        {
            for (let key in MapPages) {
                if (key == hash) 
                {
                    StartPage = key;
                    break;
                }
            }
        }
    }


    await LoadPage(StartPage, true); // when document is ready load first page

    document.getElementById("aboutPage").addEventListener("click", function (e) {
        LoadPage('about', true); // when clicked 'about' in the menu.
    });

    document.getElementById("home-page").addEventListener("click", function (e) {
        LoadPage('home', true); // when clicked 'home' in the menu.
    });

    // The following code is based off a toggle menu by @Bradcomp
    // source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('#' + burger.dataset.target);
    burger.addEventListener('click', function () {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });

    // Hide menu if click anywhere on the navigation bar.
    document.getElementById("navbarMenu").addEventListener("click", function () {
        HideMenu();
    });
});
require(["jquery"], function($) {
    console.log("Fetching IMDb ratings")
    $(function() {
        $('.highlighted-film > h3, .film-summary > h3').each(function(i){
            var that = this;

            function update(response) {
                console.log(response)
                var rating=response.rating
                var imdbUrl='http://www.imdb.com/title/'+response.imdbId+'/'
                var imdbLink='<a href="'+imdbUrl+'" style="border-bottom: 2px dotted;">IMDb</a>'
                $(that).append(' ('+rating+' on '+imdbLink+' with '+response.votes+' votes)');
            }

            currentTitle = $(this).find('a').text();

            if (currentTitle.search("2D") == 0 || currentTitle.search("3D") == 0)
                currentTitle=currentTitle.substring(5)

            //console.log(currentTitle);

            var cached = localStorage.getItem(currentTitle)

            console.log("Retrieving rating for " + currentTitle)
            if(cached) {

                console.log("Cache hit for "+currentTitle)
                update(jQuery.parseJSON(cached))

            } else {
                console.log("http://gregd.me:9001/api/rating/" + currentTitle)
                $.ajax( "http://gregd.me:9001/api/rating/" + currentTitle, {
                    success: function(response) {
                        console.log("Cache miss for "+currentTitle)
                        localStorage.setItem(currentTitle, JSON.stringify(response))
                        update(response)
                    },
                    error: function() {console.log("failed to retrieve rating for: "+currentTitle)}
                })
            }

        } );
    });
});

require(["underscore"], function (_) {
    function getFilmsDivs() {
        var filmSeperators = _(
            document.getElementsByClassName("film-summary")
        ).map(function(f) {
            return f.previousElementSibling.previousElementSibling
        })

        _(filmSeperators).each(function(film) {
            assert(film.className == "dashed", "Unable to group film divs")
        })

        var films = _(filmSeperators).map(function(filmElem) {
            function until(notCondition,elem,acc) {
                acc = acc || []
                if(notCondition(elem)) {
                    return acc
                } else {
                    var nextElem = elem.nextElementSibling
                    acc = Array.prototype.concat( acc, nextElem)
                    return until(notCondition, nextElem, acc)
                }
            }
            return until( 
                function(elem) {return elem.className == "dashed"},
                elem 
            )
        })
        
    }

    function assert(condition,errorMsg) {
        if(!condition) {
            console.log("Assertion failed: "+errorMsg)
            throw errorMsg
        }
    }
    
    console.log(getFilmsDivs())
});

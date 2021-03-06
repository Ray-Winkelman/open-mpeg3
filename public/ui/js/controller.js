/*
   This is a simple client for a REST API to play MP3 files.    
   Author: Ray Winkelman, raywinkelman@gmail.com
   Date: August 4, 2017
*/
const apiUrl = '';
let albumArt = [];
let next = {
    dir: '',
    filename: ''
};

function getSongs() {
    $('#album-art-col').hide();
    $.ajax({
        url: apiUrl.concat('/files'),
        success: function(result) {
            let table = $('#tracklist')
            // Map the availible album art.
            utilities.jsonToStrMap(result).forEach(function(m) {
                m.forEach(f => {
                    if(f.endsWith(".jpg") || f.endsWith(".png")) {
                        albumArt.push(f);
                    }
                });
            });

            $.each(JSON.parse(result), function(i, v) {
                let x = 0
                $.each(v, function(index, value) {
                    if(!value.endsWith(".mp3")) {
                        return;
                    }
                    x++;
                    let params = x == 1 ? {
                        'style': 'background-color:	#000000'
                    } : {}
                    table.append($.el('tr', params)
                        .append($.el('td', {})
                            .append(x))
                        .append($.el('td', {})
                            .append(i))
                        .append($.el('td', {})
                            .append($.el('a', {
                                    'href': '#',
                                    'rel': 'external',
                                    'text': value,
                                    'data-directory': i
                                })
                                .html(utilities.getSongName(value))
                                .click(function() {
                                    playMp3(this);
                                })
                            ))
                    )
                });
            })
        }
    });
}

function playMp3(el) {
    let filename = $(el).attr('text');
    let dir = $(el).attr('data-directory');

    let song = utilities.getSongName(filename)
    $('#album-art-col').hide();
    $('title').html(song);
    $('#player').attr("src", `${apiUrl}/file?file=${filename}`);
    $('#player-text').html(`${dir} - ${song}`);
    let index = albumArt.indexOfString(utilities.getDir(filename));
    if(index >= 0) {
        $('#album-art').attr("src", `${apiUrl}/file?file=${albumArt[index]}`);
        $('#album-art-col').show();
    }
    setNext(el);
    monitorTrack();
}

function monitorTrack() {

    if(next == null) {
        return;
    }

    setTimeout(function() {
        if($('#player')[0].ended == true) {
            playMp3(next);
        } else {
            monitorTrack();
        }
    }, 1500);
}

function setNext(el) {
    next = $(el).parents("tr").next().find("a");

    // There's an active fliter so treat it as a playlist.
    let tmp = $(next).parents("tr").first().get()[0];

    // No more songs in the list, matching criteria.
    if(tmp === undefined) {
        next = null;
    } else if(tmp.style.display == "none") {
        setNext(next);
    }
}

function filterTable() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("s");
    filter = input.value.toUpperCase();
    table = document.getElementById("tracklist");
    tr = table.getElementsByTagName("tr");
    for(i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        let song = tr[i].getElementsByTagName("td")[2];
        if(td || song) {
            if(td.innerHTML.toUpperCase().indexOf(filter) > -1 || song.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
/*
    UTILITIES ==================================================================
*/
$.extend({
    el: function(el, props) {
        let $el = $(document.createElement(el));
        $el.attr(props);
        return $el;
    }
});
/*
    ON LOAD ====================================================================
*/
if(window.addEventListener) window.addEventListener("load", getSongs, false);
else if(window.attachEvent) window.attachEvent("onload", getSongs);
else window.onload = getSongs;
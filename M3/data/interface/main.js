$(()=> {
  var date, dayName, day, month, year;
  var cssRoot = ["backgroung-color", "text-color", "transparent-color", "ring-color", "opposite-color"];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var range = 270,
  sectionsDayName = 7,
  sectionsDay = 31,
  sectionsMonth = 12,
  charactersDayName = 3,
  charactersDay = 2,
  charactersMonth = 3,
  dayColor = '#FF2D55',
  monthColor = '#007AFF',
  dayNameColor = '#4CD964';
  
  const rotateRing = (input, sections, characters, ring, text, color)=> {
    var sectionWidth = range / sections;
    var initialRotation = 135 - sectionWidth / 2;
    var rotateAmount = initialRotation - sectionWidth * (input - 1);
    var start = characters * (input - 1) + (input - 1) + 1;

    $(ring).css({
      '-webkit-transform': 'rotate(' + rotateAmount + 'deg)',
      '-moz-transform': 'rotate(' + rotateAmount + 'deg)',
      '-ms-transform': 'rotate(' + rotateAmount + 'deg)',
      'transform': 'rotate(' + rotateAmount + 'deg)' });


    for (var i = start; i < start + characters; i++) {
      $(text).children('.char' + i).css({
        'color': color });

    }
  }

  const clockRotation = ()=> {
    setInterval(function () {
      var date = new Date();
      var seconds = date.getSeconds();
      var minutes = date.getMinutes();
      var hours = date.getHours();
      var secondsRotation = seconds * 6;
      var minutesRotation = minutes * 6;
      var hoursRotation = hours * 30 + minutes / 2;

      const halfHours = ((date.getHours() + 11) % 12 + 1);

      $("#seconds").css({
        '-webkit-transform': 'rotate(' + secondsRotation + 'deg)',
        '-moz-transform': 'rotate(' + secondsRotation + 'deg)',
        '-ms-transform': 'rotate(' + secondsRotation + 'deg)',
        'transform': 'rotate(' + secondsRotation + 'deg)' });

      $("#minutes").css({
        '-webkit-transform': 'rotate(' + minutesRotation + 'deg)',
        '-moz-transform': 'rotate(' + minutesRotation + 'deg)',
        '-ms-transform': 'rotate(' + minutesRotation + 'deg)',
        'transform': 'rotate(' + minutesRotation + 'deg)' });

      $("#hours").css({
        '-webkit-transform': 'rotate(' + hoursRotation + 'deg)',
        '-moz-transform': 'rotate(' + hoursRotation + 'deg)',
        '-ms-transform': 'rotate(' + hoursRotation + 'deg)',
        'transform': 'rotate(' + hoursRotation + 'deg)' });

      

      $(".pm").text(hours > 11 ? 'pm': 'am');
      $(".sec").text(seconds < 10 ? '0'+seconds : seconds);
      $("#thours").text((halfHours < 10 ? '0' + halfHours : halfHours) + ':' + (minutes < 10 ? '0'+minutes : minutes));
      $("#fhours").text((hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0'+minutes : minutes));
    }, 1000);


  }

  const loadBars = ()=> {
    for (var i = 1; i <= dayName; i++) {
      var newHeight = Math.floor(Math.random() * 85) + 5;
      var newTop = 110 - newHeight;
      $("#x" + i).css({
        'height': newHeight + 'px' });

    }
  }

  const localStorage = async()=>{
    return new Promise((resolve, reject) =>{
        chrome.storage.local.get({
          "timeType": true,
          "colors": ["#3A5E85","#a3caf5","#217cde","#212c38", "#d9e0e8"],
          "activeTheme": false,
          "activeType": 'analog',
          "hideSecond": false,
          "spin": false,
          "stars": false,
          "newTime": true
        }, (options)=>{
            resolve(options);
        })
    });
  }



  const init = async ()=> {
    $(".day-name-preview").lettering();
    $(".day-name-text").lettering();
    $(".day-preview").lettering();
    $(".day-text").lettering();
    $(".month-preview").lettering();
    $(".month-text").lettering();
    $('.day-preview').fadeTo(10, 1);
    $('.month-preview').fadeTo(10, 1);
    $('.day-name-preview').fadeTo(10, 1);


    responseOptions = await localStorage();
    colors = responseOptions.colors;
    for (let tag in colors) { 
      $(":root").get(0).style.setProperty("--" + cssRoot[tag], colors[tag]);
    }

    changeDesign(responseOptions.activeType);

    try {
      responseOptions.activeTheme ? $('#'+responseOptions.activeTheme) ? $('#'+responseOptions.activeTheme).addClass("active") : null : null;
      responseOptions.activeType ? $('#'+responseOptions.activeType) ? $('#'+responseOptions.activeType).addClass("active") : null : null;

      $("#checkedseconds")[0].checked=responseOptions.hideSecond;
      $("#checkedspin")[0].checked=responseOptions.spin;
      responseOptions.activeType !=='analog' ? !($("#cSpan").hasClass("hide")) ? $("#cSpan").addClass("hide") : null: null;
      $("#checkedstars")[0].checked=responseOptions.stars;
      hideSeconds(responseOptions.hideSecond);
      ringSpin(responseOptions.spin);
      toogleClass("#cSpan", responseOptions.spin, 'active');
      toogleClass("#cStars", responseOptions.stars, 'active');
      responseOptions.stars ? $(".starshide").css({'display':'block'}) : null;
      setPopup(responseOptions.newTime);
    }catch(err) {}

    date = new Date();
    dayName = date.getDay(); 
    day = date.getDate(); 
    monthIndex = date.getMonth();
    month = monthIndex + 1;
    $('.date').text(`${days[dayName]}, ${monthName[monthIndex]} ${day}`)

    if (dayName == 0) {
      dayName = 7;
    }

    setTimeout(function () {
      $('.day-preview').fadeTo(500, 0);
      $('.day-text').fadeTo(500, 1, function () {
        rotateRing(day, sectionsDay, charactersDay, '#r3', '.day-text', dayColor);
      });
    }, 500);

    setTimeout(function () {
      $('.month-preview').fadeTo(500, 0);
      $('.fa-cloud').fadeTo(500, 1);
      $('.temperature').fadeTo(500, 1);
      $('.bars').fadeTo(500, 1);
      $('.month-text').fadeTo(500, 1, function () {
        rotateRing(month, sectionsMonth, charactersMonth, '#r2', '.month-text', monthColor);
        loadBars();
      });
    }, 1000);

    setTimeout(function () {
      $('.day-name-preview').fadeTo(500, 0);
      $('.day-name-text').fadeTo(500, 1, function () {
        rotateRing(dayName, sectionsDayName, charactersDayName, '#r1', '.day-name-text', dayNameColor);
      });
    }, 1500);

    setTimeout(function () {
      $(".hand-container").fadeTo(500, 1, function () {
      });
    }, 2000);

    clockRotation();

    $("#checkedseconds").click(async(event)=>{
      const hideSecond = event.currentTarget.checked;
      hideSeconds(hideSecond);
      await chrome.storage.local.set({hideSecond});

    });

    $("#checkedspin").click(async(event)=>{
      const spin = event.currentTarget.checked;
      ringSpin(spin);

      toogleClass("#cSpan", spin, 'active');
      await chrome.storage.local.set({spin});
    });

    $("#checkedstars").click(async(event)=>{
      const stars = event.currentTarget.checked;
      toogleClass("#cStars", stars, 'active');
      stars ? $(".starshide").css({'display':'block'}) : $(".starshide").css({'display':'none'});
      await chrome.storage.local.set({stars});
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest(".theme-btn") || event.target.closest(".dropdown-container")) {
          return;
      } else {
        if ($(".theme-menu-btn").hasClass("active")) {
          $(".theme-menu-btn").removeClass("active");
          $("#theme-dropdown").removeClass("active");
        }
        if ($(".settings-menu-btn").hasClass("active")) {
          $(".settings-menu-btn").removeClass("active");
          $("#settings-dropdown").removeClass("active");
        }
      }

    });

    $(".settings-menu-btn").click(async()=>{
      await chrome.storage.local.set({"newTime": false});
      setPopup(false);
      if (!($(".settings-menu-btn").hasClass("active"))) {
          $(".settings-menu-btn").addClass("active");
          $("#settings-dropdown").addClass("active");
          if ($(".theme-menu-btn").hasClass("active")) {
            $(".theme-menu-btn").removeClass("active");
            $("#theme-dropdown").removeClass("active");
          }
        }else{
          $(".settings-menu-btn").removeClass("active");
          $("#settings-dropdown").removeClass("active");
        }
     });

    $(".theme-menu-btn").click(async()=>{
      await chrome.storage.local.set({"newTime": false});
      setPopup(false);
      if (!($(".theme-menu-btn").hasClass("active"))) {
        $(".theme-menu-btn").addClass("active");
        $("#theme-dropdown").addClass("active");
        if ($(".settings-menu-btn").hasClass("active")) {
          $(".settings-menu-btn").removeClass("active");
          $("#settings-dropdown").removeClass("active");
        }
      }else{
        $(".theme-menu-btn").removeClass("active");
        $("#theme-dropdown").removeClass("active");
      }
    });

    $(".toogle-theme").each(function(){
      if ($(this).val().toLowerCase()) {
        $(this).css({'background-color': $(this).val().toLowerCase()});
        $(this).click(async(event)=>{

          $(".toogle-theme").each(function(){
            if ($(this).hasClass("active")) {
              $(this).removeClass("active");
            }
          });

          var defaultColor = event.currentTarget.value.toLowerCase();
          var activeTheme = `${$(this).attr('id')}`;

          $(this).addClass("active");
          if ($("#theme-custom").hasClass("active")) {
            $("#theme-custom").removeClass("active")
          }
          $(":root").get(0).style.setProperty("--" + cssRoot[0], defaultColor);

          responseOptions = await localStorage();
          allcolors = responseOptions.colors;
          var colors = [];
          for (let i = 0; i < allcolors.length; i++) {
            colors.push(i===0 ? defaultColor : allcolors[i])
          }
          await chrome.storage.local.set({colors, activeTheme});
        });
      }
    });

    $(".clock-type").each(function(){
      $(this).click(async(event)=>{
        $(".clock-type").each(function(){
          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
          }
        });

        var activeType = `${$(this).attr('id')}`;

        activeType == 'analog' ? $("#cSpan").hasClass("hide") ? 
        $("#cSpan").removeClass("hide"): null : 
        !($("#cSpan").hasClass("hide")) ? 
        $("#cSpan").addClass("hide") : null;

        $(this).addClass("active");
        changeDesign(activeType);
        await chrome.storage.local.set({activeType});
      });
    })

     $("#theme-custom").click(async()=>{
        $(".toogle-theme").each(function(){
            if ($(this).hasClass("active")) {
              $(this).removeClass("active");
            }
        });
        if (!$("#theme-custom").hasClass("active")) {
          $("#theme-custom").addClass("active")
          await chrome.storage.local.set({ "activeTheme" : "theme-custom"});
        }

    });



    const pickr = Pickr.create({
        el: '#theme-custom',
        theme: 'monolith', // or 'monolith', or 'nano'
        container: "#theme-dropdown",
        lockOpacity: true,
        defaultRepresentation: "HSLA",
        adjustableNumbers: false,
        useAsButton: true,
        defaultRepresentation: "HEXA",
        outputPrecision: 0,
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],
        components: {
            hue: true,
            interaction: {
                hex: true,
                hsla: true,
                input: true
            }
        }

    });
    pickr.on("change", (t => {
      saveCustomColor(t.toHSLA());
    }));


    const saveCustomColor = async(HSLA)=>{
      if (HSLA) {
        const backgroundColor = `hsl(${HSLA[0]},${HSLA[1]}%,${HSLA[2]}%)`;

        const isWhite = (.3 * HSLA[1] + HSLA[2]) > (HSLA[0] > 40 && HSLA[0] < 160 ? 60 : 75);

        let transparentS = isWhite ? .75 * HSLA[1] : 1.25 * HSLA[1] + 25;
        transparentS > 100 && (transparentS = 100);
        const transparentColor = `hsl(${HSLA[0]}, ${transparentS}%, 50%)`;

        let saturation = .85 * HSLA[1];
        saturation = saturation > (isWhite ? 40 : 25) ? (isWhite ? 40 : 25) : saturation;

        const lightness = isWhite ? .65 * HSLA[2] : HSLA[2] - 20;
        const ringColor = `hsl(${HSLA[0]},${saturation}%,${lightness}%)`


        const oppositeColor = `hsl(${HSLA[0]},${saturation}%,${(isWhite ? lightness - 5 : 88)}%)`;
        const textColor = `hsl(${HSLA[0]},81%,${HSLA[2] > 80 ? 10 : 90}%)`;


        colors = [backgroundColor, textColor, transparentColor, ringColor, oppositeColor];
        for (let tag in colors) { 
          $(":root").get(0).style.setProperty("--" + cssRoot[tag], colors[tag]);
        }
        await chrome.storage.local.set({colors});
      }
    }

  }
  init();
  const changeDesign = (cls)=>{
      try {
        $(".clock-design").each(function(){
          if ($(this).hasClass("show")) {
            $(this).removeClass("show");
          }
        });
        $('.'+cls).addClass("show");
      }catch(err) {$('.analog').addClass("show");}
      
  }

  const hideSeconds = (ishide)=>{
    const ele = ["#cSeconds", "#seconds", ".sec"];
    const cls = ["active","hide","hide"];
    for (let i = 0; i < ele.length; i++) {
      toogleClass(ele[i], ishide, cls[i]);
    }
  }

  const ringSpin = (isSpin)=>{
    const spinEle = ["r1", "r2", "r3"];
    for (let i = 0; i < spinEle.length; i++) {
      toogleClass(`#${spinEle[i]}`, isSpin, spinEle[i]);
    }
  }

  const toogleClass = (ele, isActive, className)=>{
    if (isActive && !($(ele).hasClass(className))) {
      $(ele).addClass(className)
    }else if ($(ele).hasClass(className)) {
      $(ele).removeClass(className)
    }
  }

  const setPopup = (isShow)=>{
    if (isShow && $("#newtime").hasClass("hide")) {
      $("#newtime").removeClass("hide");
      if (!($("#newtime").hasClass("dropdown-container"))) {
        $("#newtime").addClass("dropdown-container");
      }
    }else if (!$("#newtime").hasClass("hide")) {
      $("#newtime").addClass("hide");
      if (($("#newtime").hasClass("dropdown-container"))) {
        $("#newtime").removeClass("dropdown-container");
      }
    }
  }

});

"/portal/mis_fichadas" === window.location.pathname && _Horario(), "/portal/novedades_asistencia" === window.location.pathname && _Asistencia();
var server = "https://kity-linuxero.github.io/rrhhHorario/",
    treload = 0;

function _Horario() {
    $.getScript("http://momentjs.com/downloads/moment-with-locales.min.js", function() {
        moment.locale("es");
        var a = obtenerHorario(348e5),
            e = 0; //Corrección
        calcular(a, e), $("select").on("change", function() {
            setCookie($(this).attr("dataDate"), $(this).val(), 60), calcular(a, e)
        }), $.getScript("http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js", function() {
            $(".boletaHora").timepicker({
                timeFormat: "HH:mm ",
                interval: 1,
                minTime: "00:00",
                maxTime: "22:00",
                startTime: "12:00",
                dynamic: !1,
                dropdown: !1,
                scrollbar: !1
            }), $(".boletaInst").timepicker({
                timeFormat: "HH:mm",
                interval: 1,
                minTime: "00:00",
                maxTime: "02:00",
                startTime: "00:00",
                dynamic: !1,
                dropdown: !1,
                scrollbar: !1
            }), $(".boletaHora").on("change", function() {
                "" === $(this).val() && $(this).val("00:00");
                var a = $(this).parents("#resumen");
                if ("00:00" !== $(this).val()) {
                    var e = moment($(a).find(".salida").html(), "HH:mm:ss"),
                        t = moment($(this).val(), "HH:mm"),
                        o = moment.duration(e.diff(t));
                    $(a).find(".boletaInst").val(moment.utc(o.asMilliseconds()).format("HH:mm:ss")), $(a).find(".boletaInst").trigger("change")
                } else $(a).find(".boletaInst").val(formatearHoraH(0)), $(a).find(".boletaInst").trigger("change")
            }), $(".boletaInst").on("change click", function() {
                "" === $(this).val() && $(this).val("00:00"), setCookie($(this).attr("dataDate"), $(this).val(), 60), calcular(a, e);
                var t = $(this).parents("#resumen"),
                    o = $(t).find(".salida").html();
                $(t).find(".boletaHora").val(o)
            })
        })
    })
}

function _Asistencia() {
    $.getScript("http://momentjs.com/downloads/moment-with-locales.min.js", function() {
        moment.locale("en"), asistencia()
    })
}

function calcular(a, e) {
    var t = $("main div.container div.row > div.col")[0],
        o = null,
        i = nombreUsuario(),
        r = "",
        n = "";
    $(t).children().each(function(t, s) {
        var l = null,
            d = 0,
            c = 0;
        switch (t) {
            case 1:
                r = obtenerDia(s);
                break;
            case 2:
                o = obtenerHoraIngreso(s, a, i, r);
                break;
            case 5:
                if ((l = obtenerFichadas(s)).length > 0) {
                    var m = calcularPermanencia(o, l, a, e, i, r),
                        f = "Hora de ingreso: " + o.format("HH:mm:ss");
                    Cargarformulario(s, r), mostrar(m, s, f, o, a, e, i, r), d = compensacion(m, o, a, e, i, r), c = m.enEdificio, setCookie(i + r, d, 60), setCookie(i + r + "enEdificio", c, 60), historicoSemana(r, s, m, e)
                }
                break;
            case 8:
                r = obtenerDia(s);
                break;
            case 9:
                "" !== r ? o = obtenerHoraIngreso(s, a, i, r) : n = obtenerDia(s);
                break;
            case 10:
                "" !== n && (o = obtenerHoraIngreso(s, a, i, r = n));
                break;
            case 12:
                if ((l = obtenerFichadas(s)).length > 0 && "" !== r) {
                    m = calcularPermanencia(o, l, a, e, i, r), f = "Hora de ingreso: " + o.format("HH:mm:ss");
                    Cargarformulario(s, r), mostrar(m, s, f, o, a, e, i, r), d = compensacion(m, o, a, e, i, r), c = m.enEdificio, setCookie(i + r, d, 60), setCookie(i + r + "enEdificio", c, 60), historicoSemana(r, s, m, e)
                }
        }
    })
}

function obtenerHoraIngreso(a, e, t, o) {
    var i = e.horarioIngreso.clone();
    try {
        var r = $(a).find("h1.center").html();
        r = $.trim(r).slice(-8);
        var n = moment(r, "HH:mm:ss")
    } catch (a) {
        n = i.clone();
        console.log("Error en obtenerHoraIngreso (Primera Fichada)"), console.log(a)
    }
    switch (getCookie(t + o + "comision")) {
        case "Entrada":
            return i;
        default:
            return EsControlable(), n
    }
}

function obtenerHorario(a) {
    var e = $("main div.container div.row > div.col")[0],
        t = moment("08:00", "HH:mm"),
        o = moment("15:00", "HH:mm"),
        i = a,
        r = !1;
    return $(e).children().each(function(a, e) {
        switch (a) {
            case 4:
                try {
                    var n = $(e).find("h6.center");
                    t = moment($(n[0]).html().trim(), "HH:mm"), o = moment($(n[1]).html().trim(), "HH:mm"), i = o.diff(t)
                } catch (a) {
                    console.log("Error en obtener horarios 1"), r = !0
                }
                break;
            case 11:
                if (r) try {
                    n = $(e).find("h6.center");
                    t = moment($(n[0]).html().trim(), "HH:mm"), o = moment($(n[1]).html().trim(), "HH:mm"), i = o.diff(t)
                } catch (a) {
                    console.log("Error en obtener horarios 2")
                }
        }
    }), {
        horarioIngreso: t,
        horarioEgreso: o,
        Ths: i
    }
}

function obtenerFichadas(a) {
    var e = [],
        t = "",
        o = "";
    return $(a).find("#tabla3 tbody tr").each(function() {
        var a = "HH:mm:ss";
        hora = $(this).find("td:nth(0)").html(), hora.indexOf(" ") > 0 && (a = "DD-MM-YYYY " + a), hh = moment(hora, a), (t = $(this).find("td:nth(1)").html()) != o ? e.push({
            fichada: hh,
            tipo: t
        }) : (e[e.length - 1].fichada = hh, e[e.length - 1].tipo = t), o = t
    }), e
}

function calcularPermanencia(a, e, t, o, i, r) {
    var n = 0,
        s = 0,
        l = 0;
    getCookie(i + r + "comision");
    if (e.length > 0) {
        e[0] = {
            fichada: a,
            tipo: "Entrada"
        };
        for (var d = 1; d < e.length; d += 2) n += moment.duration(e[d].fichada.diff(e[d - 1].fichada));
        var c = moment();
        "Entrada" == e[e.length - 1].tipo ? (n += moment.duration(c.diff(e[e.length - 1].fichada)), ultima = c, l = t.Ths - o - n) : ultima = e[e.length - 1].fichada, s = moment.duration(ultima.diff(e[0].fichada))
    }
    return {
        enEdificio: n,
        fuera: s - n,
        falta: l,
        total: s
    }
}

function Cargarformulario(a, e) {
    var t = $(a).find(".resumen"),
        o = document.getElementById("linkestilo"),
        i = (document.getElementById("linkestilo2"), (new Date).getTime());
    if (null === o && ($("head").append('<link type="text/css" href="' + server + "Horario.css?t=" + i + '" rel="Stylesheet" id="linkestilo">'), $("head").append('<link type="text/css" href="' + server + "bootstrap.css?t=" + i + '" rel="Stylesheet" id="linkestilo">'), $("head").append('<link type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css" rel="Stylesheet" id="linkestilo">')), null === t || 0 === t.length) {
        var r;
        $.ajax({
            type: "GET",
            url: server + "Horario.html?t=" + i,
            async: !1,
            success: function(a) {
                r = a
            }
        }), $(a).append(r);
        var n = nombreUsuario(),
            s = getCookie(n + e + "comision");
        SetearComision(a, s, n, e);
        var l = getCookie(n + e + "boleta");
        SetearBoleta(a, l, n, e), $(".licencia").attr("href", server + "License.txt"), $(".detalleDia").click(function(e) {
            e.preventDefault();
            var t = $(this),
                o = $($(a).find(".resumen #detalleDia"));
            t.hasClass("show") ? (t.removeClass("show"), t.html('<i class="fa fa-plus"></i>'), o.slideUp(350)) : (t.toggleClass("show"), t.html('<i class="fa fa-minus"></i>'), o.slideToggle(350))
        }), $(".detalleSemana").click(function(e) {
            e.preventDefault();
            var t = $(this),
                o = $($(a).find("#detalleSemana"));
            t.hasClass("show") ? (t.removeClass("show"), t.html('<i class="fa fa-plus"></i>'), o.slideUp(350)) : (t.toggleClass("show"), t.html('<i class="fa fa-minus"></i>'), o.slideToggle(350))
        })
    }
}

function mostrar(a, e, t, o, i, r, n, s) {
    var l = $(e).find(".resumen"),
        d = compensacion(a, o, i, r, n, s),
        c = obtenerBoletaDuration(n, s),
        m = $(l).find("table tbody tr"),
        f = 0,
        h = o;
    if (0 !== a.falta) {
        var u = moment().add(a.falta, "ms"),
            b = o.add(i.Ths, "ms");
        (u > b || d < 0) && a.enEdificio > 216e5 ? (f = CalcualarBoleta(u, b, a.fuera, r, a, i), u > b && (u = b)) : u > b && (u = b), (u = u.subtract(c.asMilliseconds(), "ms")) < moment() && 0 === $("main div.container").find("div.chau").length && ($("main div.container").prepend('<div class="chau col s12" style="background-color:orange;"><h3 style="background-color:orange;"><center>¡¡Chauuu!! Te podes ir <i class="fa fa-hand-stop-o" aria-hidden="true"></i></center></h1></div>'), parpadear(), alerta("Horario cumplido", "info")), u.clone().subtract(184e3, "ms") < moment(), window.actualizarPermanencia || (window.actualizarPermanencia = setInterval(function() {
            calcular(i, r)
        }, 1e3))
    } else {
        //window.actualizarSonido && window.clearInterval(window.actualizarSonido);
        l = o.clone();
        ((u = o.add(a.total.asMilliseconds(), "ms")) > (b = l.add(i.Ths, "ms")) || d < 0) && a.enEdificio > 216e5 && (f = CalcualarBoleta(u, b, a.fuera, r, a, i))
    }
    f = CalcualarBoleta(u, b, a.fuera, r, a, i), $(e).find("span.aviso").html(""), $(e).find("span.fuera").html(formatearHora(a.fuera)), $(e).find("span.edificio").html(formatearHora(a.enEdificio)), m.find(".compensacion").html(formatearHora(d)), $(e).find("span.boletaSoli").html(formatearHora(c)), f > 0 ? ($(m).find(".boleta").html(formatearHora(f)), $(m).find(".boleta").removeClass().addClass("label label-danger boleta"), boleta1 = a.fuera - r, 0 !== a.falta ? boleta1 - c > 0 && $(e).find("span.aviso").html(" -- Podría solicitar boleta de " + formatearHora(boleta1 - c) + "hs(1)") : f - c > 0 && $(e).find("span.aviso").html(" -- Debería solicitar boleta de " + formatearHora(f - c) + "hs(2)")) : ($(m).find(".boleta").html(formatearHora(0)), $(m).find(".boleta").removeClass().addClass("boleta")), h.asMilliseconds > 36e6 && $(e).find("span.aviso").html(" -- Debería solicitar comisión de entrada(3)"), 0 === a.falta && a.enEdificio < 216e5 && $(e).find("span.aviso").html(" -- Debería solicitar comisión de salida(4)"), $(e).find("span.salida").html(u.format("HH:mm:ss")), $(e).find(".falta").html(formatearHora(a.falta - c));
    var v = $(e).find(".resumen div.box-header .box-title")[0];
    $(v).html("Resumen del día( " + t + ")"), treload += 1e3, $(".recarga").html(formatearHora(treload))
}

function CalcualarBoletaOld(a, e, t, o, i, r) {
    var n = 0;
    return (n = a > e ? t - o : r.Ths - i.enEdificio - o) > 0 ? n : 0
}

function CalcualarBoleta(a, e, t, o, i, r) {
    var n, s, l = 0;
    return (l = (n = t - o) > (s = r.Ths - i.enEdificio - o) ? n : s) > 0 ? l : 0
}

function obtenerComision(a) {
    var e = "",
        t = $(a).find(".resumen"),
        o = $(t).find("table tbody tr");
    0 === !o.length && (e = $(o).find(".comision").val());
    return e
}

function SetearComision(a, e, t, o) {
    var i = $(a).find(".resumen"),
        r = $(i).find("table tbody tr");
    if (0 !== r.length) {
        var n = $(r).find(".comision");
        n.val(e), t = nombreUsuario(), n.attr("dataDate", t + o + "comision")
    }
}

function obtenerBoleta(a) {
    var e = "",
        t = $(a).find(".resumen"),
        o = $(t).find("table tbody tr");
    0 === !o.length && (e = $(o).find(".boletaInst").val());
    return e
}

function obtenerBoletaDuration(a, e) {
    var t = moment("00:00", "HH:mm"),
        o = moment.duration(t.diff(t)),
        i = getCookie(a + e + "boleta");
    if ("" !== i) {
        var r = moment(i, "HH:mm");
        o = moment.duration(r.diff(t))
    }
    return o
}

function SetearBoleta(a, e, t, o) {
    var i = $(a).find(".resumen"),
        r = $(i).find("table tbody tr");
    if (0 !== r.length) {
        var n = $(r).find(".boletaInst");
        n.val(e), t = nombreUsuario(), n.attr("dataDate", t + o + "boleta")
    }
}

function compensacion(a, e, t, o, i, r) {
    var n = 0;
    switch (getCookie(i + r + "comision")) {
        case "Salida":
        case "Día":
            n = 0;
            break;
        default:
            if (a.total > 0)
                if (a.falta <= 0 && a.fuera <= o && a.enEdificio > t.Ths - o) {
                    if (n = a.enEdificio - t.Ths, "" !== (s = getCookie(i + r + "boleta"))) n += obtenerBoletaDuration(i, r);
                    n < 0 && (n = 0)
                } else {
                    var s = getCookie(i + r + "boleta");
                    if (n = a.enEdificio - (t.Ths - o), "" !== s)(n += obtenerBoletaDuration(i, r)) > 0 && (n = 0)
                }
    }
    var l = 72e5;
    return t.Ths >= 288e5 && (l = 48e5), n > l && (n = l), n
}

function formatearHora(a) {
    var e = moment.duration(a, "ms");
    return pad(e.get("h"), 2) + ":" + pad(e.get("m"), 2) + ":" + pad(e.get("s"), 2)
}

function formatearHoraH(a) {
    var e = moment.duration(a, "ms"),
        t = parseInt(e.asHours()),
        o = moment.duration(e - moment.duration(t, "hours")).minutes();
    return pad(t, 2) + ":" + pad(o, 2)
}

function pad(a, e) {
    for (var t = a + ""; t.length < e;) t = "0" + t;
    return t
}

function obtenerDia(a) {
    var e = "";
    try {
        e = $(a).find("h6.center").html()
    } catch (a) {
        console.log("Error en obtener dia")
    }
    return e
}

function setCookie(a, e, t) {
    var o = new Date;
    o.setTime(o.getTime() + 24 * t * 60 * 60 * 1e3);
    var i = "expires=" + o.toUTCString();
    document.cookie = a + "=" + e + ";" + i + ";path=/"
}

function getCookie(a) {
    for (var e = a + "=", t = document.cookie.split(";"), o = 0; o < t.length; o++) {
        for (var i = t[o];
            " " == i.charAt(0);) i = i.substring(1);
        if (0 === i.indexOf(e)) return i.substring(e.length, i.length)
    }
    return ""
}

function ProcesarDia(a) {
    $("#fecha_historial").val(a), $(".btn").trigger("click")
}

function diadelaSemana(a, e) {
    for (var t = !1, o = 0; o <= 6; o += 1)
        if (a.day(o).format("YYYYMMDD") === e.format("YYYYMMDD")) {
            t = !0;
            break
        } return t
}

function historicoSemana(a, e, t, o) {
    for (var i = moment(a, "DD-MM-YYYY"), r = moment(moment().format("DD-MM-YYYY"), "DD-MM-YYYY"), n = null, s = 0, l = 0, d = 0, c = "<li><b>Compensación:</b></li><br />", m = "<li><b>En Edificio:</b></li><br />", f = nombreUsuario(), h = 1; h < 6; h += 1) i.day(h) <= r && (c += '<div class="col-md-2">', c += '<div class="box box-default">', "" !== (n = getCookie(f + i.day(h).format("DD-MM-YYYY"))) ? (s += 1 * n, i.day(h) < r && (l += 1 * n), c += '<div class="box-header with-border">', c += '\t<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">', c += i.day(h).format("dddd"), c += "\t</h3>", c += "</div>", c += '<div class="box-body" style="text-align:center;">', c += "" + formatearHora(1 * n), c += "</div>", c += '<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">', c += "\t<a href=\"javascript:ProcesarDia('" + i.day(h).format("DD-MM-YYYY") + "')\"> Actualizar", c += '\t\t<i class="fa fa-refresh"></i>', c += "\t</a>", c += "</div>") : (c += '<div class="box-header with-border">', c += '\t<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">', c += i.day(h).format("dddd"), c += "\t</h3>", c += "</div>", c += '<div class="box-body" style="text-align:center;">', c += "" + formatearHora(0), c += "</div>", c += '<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">', c += "\t<a href=\"javascript:ProcesarDia('" + i.day(h).format("DD-MM-YYYY") + "')\"> Actualizar", c += '\t\t<i class="fa fa-refresh"></i>', c += "\t</a>", c += "</div>"), c += "</div>", c += "</div>", m += '<div class="col-md-2">', m += '<div class="box box-default">', k2 = getCookie(f + i.day(h).format("DD-MM-YYYY") + "enEdificio"), "" !== k2 ? (d += 1 * k2, m += '<div class="box-header with-border">', m += '\t<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">', m += i.day(h).format("dddd"), m += "\t</h3>", m += "</div>", m += '<div class="box-body" style="text-align:center;">', m += "" + formatearHora(1 * k2), m += "</div>", m += '<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">', m += "\t<a href=\"javascript:ProcesarDia('" + i.day(h).format("DD-MM-YYYY") + "')\"> Actualizar", m += '\t\t<i class="fa fa-refresh"></i>', m += "\t</a>", m += "</div>") : (m += '<div class="box-header with-border">', m += '\t<h3 style="text-align:center;background-color:transparent;color:#444;font-variant:normal;" class="box-title">', m += i.day(h).format("dddd"), m += "\t</h3>", m += "</div>", m += '<div class="box-body" style="text-align:center;">', m += "" + formatearHora(0), m += "</div>", m += '<div style="background:#f4f4f4;font-size:13px;" class="box-footer text-center">', m += "\t<a href=\"javascript:ProcesarDia('" + i.day(h).format("DD-MM-YYYY") + "')\"> Actualizar", m += '\t\t<i class="fa fa-refresh"></i>', m += "\t</a>", m += "</div>"), m += "</div>", m += "</div>");
    var u = '<div class="row"><div class="col-xs-12">' + c + '</div></div><div class="row"><div class="col-xs-12">' + m + "</div></div>";
    $(e).find("span.hist").html(u), $(e).find("span.s-compensacion").html(formatearHora(l)), $(e).find("span.s-enedificio").html(formatearHoraH(d));
    var b = moment();
    if (0 != t.falta) {
        var v = b.add(-1 * s);
        l < 0 && v.add(o), $(e).find("span.s-salida").html(v.format("HH:mm:ss"))
    } else $(e).find("span.s-salida").html(formatearHora(0))
}

function EsControlable() {
    var a = !1;
    return $("main i.tooltipped").each(function(e, t) {
        "Controlable" === $(t).attr("data-tooltip") && (a = !0)
    }), a
}

function nombreUsuario() {
    return $("#header-nombre-usuario").text().trim()
}

function asistencia() {
    n = nombreUsuario(), $("#mi_asistencia_tbl tbody tr").each(function(a) {
        comp = 0, Edif = 0, obj = null, $(this).children("td").each(function(a) {
            switch (a) {
                case 0:
                    d = moment($(this).text(), "DD-MMM-YY"), obj = $(this);
                    break;
                case 1:
                    comp += mostraDatosComp(n, d, $(this), 1), Edif += mostraDatosEnEdif(n, d, $(this), 1);
                    break;
                case 2:
                    comp += mostraDatosComp(n, d, $(this), 2), Edif += mostraDatosEnEdif(n, d, $(this), 2);
                    break;
                case 3:
                    comp += mostraDatosComp(n, d, $(this), 3), Edif += mostraDatosEnEdif(n, d, $(this), 3);
                    break;
                case 4:
                    comp += mostraDatosComp(n, d, $(this), 4), Edif += mostraDatosEnEdif(n, d, $(this), 4);
                    break;
                case 5:
                    comp += mostraDatosComp(n, d, $(this), 5), Edif += mostraDatosEnEdif(n, d, $(this), 5)
            }
        }), s = obj.html(), obj.html(s + "<br/>Comp: " + formatearHoraH(comp) + "<br/>en Edif: " + formatearHoraH(Edif))
    })
}

function mostraDatosComp(a, e, t, o) {
    return k = getCookie(a + e.day(o).format("DD-MM-YYYY")), compensa = 0, "" !== k && (compensa = 1 * k), s = t.html(), t.html(s + "<br/>Comp: " + formatearHora(compensa)), compensa
}

function mostraDatosEnEdif(a, e, t, o) {
    return Edif = 0, k2 = getCookie(a + e.day(o).format("DD-MM-YYYY") + "enEdificio"), "" !== k2 && (Edif = 1 * k2), s = t.html(), t.html(s + "<br/>en Edif: " + formatearHora(Edif)), Edif
}

function parpadear() {
    $(".chau").fadeIn(350).delay(150).fadeOut(350, parpadear)
}

function dragElement(a) {
    var e = 0,
        t = 0,
        o = 0,
        i = 0;

    function r(a) {
        a = a || window.event, o = a.clientX, i = a.clientY, document.onmouseup = s, document.onmousemove = n
    }

    function n(r) {
        r = r || window.event, e = o - r.clientX, t = i - r.clientY, o = r.clientX, i = r.clientY, a.style.top = a.offsetTop - t + "px", a.style.left = a.offsetLeft - e + "px"
    }

    function s() {
        document.onmouseup = null, document.onmousemove = null
    }
    document.getElementById(a.id + "header") ? document.getElementById(a.id + "header").onmousedown = r : a.onmousedown = r
}
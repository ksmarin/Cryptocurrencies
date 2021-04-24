const UsuarioCriptomoneda = require("./../models/usuarioCriptomoneda");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

let index = async (req, res) => {
  let monedaUsuario = req.usuario.moneda;

  let params = {
    vs_currency: monedaUsuario,
  };

  let data = await CoinGeckoClient.coins.markets(params);

  data = data.data.map((moneda) => {
    return {
      Simbolo: moneda.symbol,
      Precio: moneda.current_price,
      Nombre: moneda.name,
      Imagen: moneda.image,
      "Fecha última actualización": moneda.last_updated,
    };
  });

  return res.json(data);
};

let guardar = async (req, res) => {
  let usuario = req.usuario._id;
  let id = await buscarIdMoneda(req.body.simbolo);

  let usuarioCriptomoneda = new UsuarioCriptomoneda({
    simbolo: req.body.simbolo,
    idmoneda: id,
    usuario: usuario,
  });

  validarRelacion(usuarioCriptomoneda, (respuesta) => {
    if (respuesta) {
      return res.json({
        ok: false,
        mensaje: "Ya se guardo esta moneda",
      });
    }

    usuarioCriptomoneda.save((err, usuarioCriptomonedaNew) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
        });
      }

      return res.status(201).json({
        ok: true,
        usuario: usuarioCriptomonedaNew,
      });
    });
  });
};

let buscarIdMoneda = async (params) => {
  let idMonedas = await CoinGeckoClient.coins.list();
  let id = idMonedas.data.find((coin) => coin.symbol === params);
  return id.id;
};

let buscarTotalMonedas = async (params) => {
  let idMonedas = await CoinGeckoClient.coins.markets(params);
  return idMonedas;
};

let validarRelacion = async (usuarioCriptomoneda, callback) => {
  UsuarioCriptomoneda.find({})
    .where("usuario")
    .in(usuarioCriptomoneda.usuario)
    .where("simbolo")
    .in(usuarioCriptomoneda.simbolo)
    .exec(async (err, data) => {
      callback(data == 0 ? false : true);
    });
};

let verTop = async (req, res) => {
  let top = req.query.top || 25;
  if (top > 25) {
    return res.status(500).json({
      ok: false,
      message : "El top no puede ser mayor a 25",
    });
  }
  console.log(top);

  // return res.json(req.query);

  let usuario = req.usuario._id;

  UsuarioCriptomoneda.find({})
    .where("usuario")
    .in(usuario)
    .exec(async (err, data) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      let monedaUsuario = req.usuario.moneda;

      let ids = data.map((dato) => {
        return dato.idmoneda;
      });

      let params = {
        vs_currency: monedaUsuario,
        ids,
      };

      let monedasTotales = await buscarTotalMonedas(params);

      var monedasUsuario = [];
      for (const property in data) {
        let data2 = await CoinGeckoClient.simple.price({
          ids: [data[property].idmoneda],
          vs_currencies: ["usd", "eur", "ars"],
        });

        let dataMoneda = monedasTotales.data.find(
          (element) => element.symbol === data[property].simbolo
        );

        let idMoneda = data[property].idmoneda;

        let monedaSeguimiento = {
          idMoneda,
          Simbolo: data[property].simbolo,
          "Precio en Pesos Argentinos": data2.data[idMoneda].ars,
          "Precio en Dólares": data2.data[idMoneda].usd,
          "Precio en Euros": data2.data[idMoneda].eur,
          Nombre: dataMoneda.name,
          Imagen: dataMoneda.image,
          "Fecha última actualización": dataMoneda.last_updated,
        };

        monedasUsuario.push(monedaSeguimiento);
      }

      return res.json(monedasUsuario);
    });
};

module.exports = {
  index,
  guardar,
  verTop,
};

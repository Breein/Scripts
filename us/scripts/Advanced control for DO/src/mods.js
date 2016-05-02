module.exports = function(section){
  var m, mods, mod, result = {};

  mods = {
    "Снайперские винтовки":{
      "1":{fn:"Damage Multiplier Light",name:"[DM]",d:"Повреждение: +8",f:"1/10"},
      "2":{fn:"Barrel Greaser",name:"[BG]",d:"Повреждение: +13",f:"1/70"},
      "3":{fn:"Damage Multiplier Heavy",name:"[DH]",d:"Повреждение: +10",f:"1/40"},
      "6":{fn:"Longbow Barrel",name:"[LB]",d:"Дальность: +2",f:"крайне редко"}
    },

    "Пистолеты-пулемёты":{
      "7":{fn:"Reloader",name:"[RL]",d:"Выстрелов: +4",f:"крайне редко"},
      "31":{fn:"One Hand Shot",name:"[OHS]",d:"Выстрелов: +1[2]",f:"крайне редко"},
      "32":{fn:"Two Extra Shots",name:"[TES]",d:"Выстрелов: +2",f:"крайне редко"},
      "33":{fn:"Mad Shooting",name:"[MS]",d:"Выстрелов: +3",f:"крайне редко"},
      "34":{fn:"Bullet Proof",name:"[BP]",d:"Дальность: +2",f:"крайне редко"},
      "35":{fn:"Ancient Damage",name:"[AD]",d:"Повреждение: +1",f:"1/10"},
      "36":{fn:"Two Nails",name:"[TN]",d:"Выстрелов: +2",f:"крайне редко"},
      "37":{fn:"Third and Mortal",name:"[TM]",d:"Выстрелов: +3",f:"крайне редко"},
      "38":{fn:"One Plus Three",name:"[OPT]",d:"Выстрелов: +4",f:"крайне редко"},
      "42":{fn:"Heavy Bullets",name:"[HB]",d:"Повреждение: +4",f:"1/70"},
      "43":{fn:"Digital Distance",name:"[DD]",d:"Дальность: +1",f:"1/40"},
      "44":{fn:"Sharp Shooter",name:"[ShS]",d:"Точность стрельбы: +10 %",f:"1/20"}
    },

    "Штурмовые винтовки":{
      "4":{fn:"FastShot",name:"[FS]",d:"Выстрелов: +4",f:"крайне редко"},
      "10":{fn:"Iron Bullets",name:"[IB]",d:"Повреждение: +1",f:"1/10"},
      "11":{fn:"Killing Thing",name:"[KT]",d:"Повреждение: +2",f:"1/10"},
      "12":{fn:"Heavy Killing Thing",name:"[HKT]",d:"Повреждение: +3",f:"1/30"},
      "13":{fn:"Poisoned Bullets",name:"[PB]",d:"Повреждение: +5",f:"крайне редко"},
      "14":{fn:"Extreme Shots",name:"[ES]",d:"Повреждение: +4",f:"1/70"},
      "15":{fn:"Digital Distance",name:"[DD]",d:"Дальность: +1",f:"1/30"},
      "16":{fn:"Longshot Yellow",name:"[LY]",d:"Дальность: +2",f:"1/80"},
      "17":{fn:"Speed Switch",name:"[SS]",d:"Выстрелов: +2",f:"1/50"},
      "18":{fn:"Ultra Shooter",name:"[US]",d:"Выстрелов: +3",f:"1/80"},
      "19":{fn:"One Bullet",name:"[OB]",d:"Выстрелов: +1",f:"1/10"},
      "20":{fn:"Digital Aim",name:"[DA]",d:"Точность стрельбы: +10 %",f:"1/20"},
      "21":{fn:"SharpShooter",name:"[ShS]",d:"Точность стрельбы: +15 %",f:"1/50"}
    },

    "Пулемёты":{
      "22":{fn:"Big Heavy Gun",name:"[BHG]",d:"Выстрелов: +5",f:"1/70"},
      "23":{fn:"Floo Shots",name:"[FSh]",d:"Выстрелов: +3",f:"1/40"},
      "24":{fn:"Deadly Plumbum",name:"[DP]",d:"Повреждение: +1",f:"1/10"},
      "25":{fn:"Head Shots",name:"[HS]",d:"Повреждение: +2",f:"1/50"},
      "26":{fn:"High Density",name:"[HD]",d:"Точность стрельбы: +3 %",f:"1/40"},
      "39":{fn:"Freakin Gun",name:"[FG]",d:"Дальность: +2",f:"1/70"},
      "40":{fn:"Super High Density",name:"[SHD]",d:"Выстрелов: +7",f:"крайне редко"},
      "41":{fn:"Heavy Optics",name:"[HO]",d:"Дальность: +2, Выстрелов: +2, Повреждение: +2",f:"крайне редко"}
    },

    "Дробовики":{
      "5":{fn:"Fast Loader",name:"[FL]",d:"Выстрелов: +1",f:"1/10"},
      "8":{fn:"JackLong",name:"[JL]",d:"Дальность: +2",f:"1/70"},
      "9":{fn:"Salted Bullets",name:"[SB]",d:"Повреждение: +10",f:"крайне редко"}
    },

    "Гранатометы":{
      "27":{fn:"Boom Distance",name:"[BD]",d:"Дальность: +1",f:"1/40"},
      "28":{fn:"Super Boom Distance",name:"[SBD]",d:"Дальность: +2",f:"крайне редко"},
      "29":{fn:"Kaboom Kaboom",name:"[KK]",d:"Повреждение: +10",f:"1/70"},
      "30":{fn:"BoomBastic",name:"[BB]",d:"Точность стрельбы: +10 %",f:"1/70"}
    },

    "Шлемы":{
      "1":{fn:"Extra Armour",name:"[EA]",d:"Броня головы: +1",f:"1/10"},
      "2":{fn:"Delta Force",name:"[DF]",d:"Броня головы:+2",f:"1/30"},
      "3":{fn:"TiHelmet",name:"[TH]",d:"Броня головы: +3",f:"1/50"},
      "10":{fn:"Red Cross",name:"[RC]",d:"Здоровье: +1",f:"1/10"},
      "13":{fn:"Bushnell Trophy(BT)",name:"[BT]",d:"Меткость: +2",f:"1/50"},
      "14":{fn:"Bushnell Elite",name:"[BE]",d:"Меткость: +3",f:"крайне редко"},
      "28":{fn:"Extra Armour",name:"[EAA]",d:"Активной броони головы: +4 %",f:"1/30"},
      "31":{fn:"Heavy Armour",name:"[HAA]",d:"Активной броони головы: +8 %",f:"крайне редко"},
      "36":{fn:"Solid Armour",name:"[SA]",d:"Активной броони головы: +6 %",f:"крайне редко"},
      "42":{fn:"Extra Damage",name:"[ED]",d:"Бонус урона: +2",f:"1/30"},
      "45":{fn:"Heavy Damage",name:"[HD]",d:"Бонус урона: +3",f:"1/50"},
      "48":{fn:"Raged Damage",name:"[RD]",d:"Бонус урона: +4",f:"крайне редко"}
    },

    "Броня":{
      "4":{fn:"Extra Armour",name:"[EA]",d:"Броня корпуса: +1",f:"1/10"},
      "5":{fn:"Kenny Hope",name:"[KH]",d:"Броня корпуса: +2",f:"1/50"},
      "6":{fn:"Heavy Mass",name:"[HM]",d:"Броня корпуса: +3",f:"крайне редко"},
      "11":{fn:"Red Cross",name:"[RC]",d:"Здоровье: +1",f:"1/10"},
      "15":{fn:"Strongman",name:"[S]",d:"Выносливость: +2",f:"1/50"},
      "16":{fn:"Power Armour",name:"[PA]",d:"Выносливость: +3",f:"крайне редко"},
      "29":{fn:"Extra Armour",name:"[EAA]",d:"Активной броони корпуса: +4 %",f:"1/30"},
      "32":{fn:"Heavy Armour",name:"[HAA]",d:"Активной броони корпуса: +8 %",f:"крайне редко"},
      "37":{fn:"Solid Armour",name:"[SA]",d:"Активной броони корпуса: +6 %",f:"крайне редко"},
      "43":{fn:"Extra Damage",name:"[ED]",d:"Бонус урона: +2",f:"1/30"},
      "46":{fn:"Heavy Damage",name:"[HD]",d:"Бонус урона: +3",f:"1/50"},
      "49":{fn:"Raged Damage",name:"[RD]",d:"Бонус урона: +4",f:"крайне редко"}
    },

    "Броня ног":{
      "7":{fn:"Extra Armour",name:"[EA]",d:"Броня ног: +1",f:"1/10"},
      "8":{fn:"Bush Stump",name:"[BS]",d:"Броня ног: +2",f:"1/50"},
      "9":{fn:"Titanium Buttons",name:"[TB]",d:"Броня ног: +3",f:"крайне редко"},
      "12":{fn:"Red Cross",name:"[RC]",d:"Здоровье: +1",f:"1/10"},
      "17":{fn:"Power Boots",name:"[PB]",d:"Сила: +2",f:"1/50"},
      "18":{fn:"Hardened Power Boots",name:"[HPB]",d:"Сила: +3",f:"крайне редко"},
      "30":{fn:"Extra Armour",name:"[EAA]",d:"Активной броони ног: +4 %",f:"1/30"},
      "33":{fn:"Heavy Armour",name:"[HAA]",d:"Активной броони ног: +8 %",f:"крайне редко"},
      "38":{fn:"Solid Armour",name:"[SA]",d:"Активной броони ног: +6 %",f:"крайне редко"},
      "40":{fn:"Jumping Boots",name:"[JB]",d:"Второй шаг: +1",f:"1/10"},
      "44":{fn:"Extra Damage",name:"[ED]",d:"Бонус урона: +2",f:"1/30"},
      "47":{fn:"Heavy Damage",name:"[HD]",d:"Бонус урона: +3",f:"1/50"},
      "50":{fn:"Raged Damage",name:"[RD]",d:"Бонус урона: +4",f:"крайне редко"}
    },

    "Маскировка":{
      "23":{fn:"More mask",name:"[MM]",d:"Маскировка: +1 %",f:"1/10"},
      "24":{fn:"Cigar Smoke",name:"[CS]",d:"Маскировка: +2 %",f:"1/30"},
      "25":{fn:"Invisible Man",name:"[IM]",d:"Маскировка: +3 %",f:"крайне редко"},
      "26":{fn:"Strongman",name:"[S]",d:"Выносливость: +2",f:"1/50"},
      "27":{fn:"Super Strongman",name:"[SS]",d:"Выносливость: +3",f:"крайне редко"},
      "41":{fn:"Third Pocket",name:"[TP]",d:"«Туз в рукаве»: +1",f:"1/50"}
    },

    "Тепловизоры":{
      "19":{fn:"Clean Optics",name:"[CO]",d:"Тепловизор: +3 %",f:"крайне редко"},
      "20":{fn:"Light Vision",name:"[LV]",d:"Тепловизор: +2 %",f:"1/50"},
      "21":{fn:"Extra Power",name:"[EP]",d:"Тепловизор: +1 %",f:"1/10"},
      "22":{fn:"Bushnell Trophy",name:"[BT]",d:"Меткость: +2",f:"1/50"},
      "39":{fn:"Heaven's Light",name:"[HL]",d:"Тепловизор: +4 %",f:"крайне редко"}
    },

    "weapon":{
      "45":{fn:"Bloodlust",name:"[BL]",d:"Урон: +10 %",f:"крайне редко"},
      "46":{fn:"Second Try",name:"[ST]",d:"Вероятности второго выстрела: +10 %",f:"крайне редко"},
      "47":{fn:"Steel Doctor",name:"[SDC]",d:"Самолечение: +1",f:"крайне редко"},
      "48":{fn:"Optics Master",name:"[OM]",d:"Меткость: +8",f:"1/50"},
      "49":{fn:"WunderGewehr",name:"[WG]",d:"Вероятности второго выстрела: +6 %",f:"1/50"},
      "50":{fn:"Enchanted Grenade",name:"[EG]",d:"Туз в рукаве: +1",f:"1/50"},
      "51":{fn:"More Exp Please",name:"[MEP]",d:"Бонус опыта: +2",f:"крайне редко"},
      "52":{fn:"More Skills Please",name:"[MSP]",d:"Бонус умений: +2",f:"крайне редко"},
      "53":{fn:"Super Durable",name:"[SD]",d:"Бонус прочности: +3",f:"крайне редко"}
    },

    "armor":{
      "34":{fn:"Extra Skills ",name:"[ES]",d:"Бонус умений: +2",f:"крайне редко"},
      "35":{fn:"Extra Exp ",name:"[EE]",d:"Бонус опыта: +2",f:"крайне редко"}
    }
  };

  switch(section){
    case "Штурмовые винтовки":
    case "Пулемёты":
    case "Снайперские винтовки":
    case "Пистолеты-пулемёты":
    case "Дробовики":
    case "Гранатометы":
      m = mods.weapon;
      break;
    case "Броня":
    case "Шлемы":
    case "Броня ног":
      m = mods.armor;
      break;
  }

  if(mods[section] && m != null){
    for(mod in mods[section]) result[mod] = mods[section][mod];
    for(mod in m) result[mod] = m[mod];
    return result;
  }else{
    return mods[section] != null ? mods[section] : m;
  }
};

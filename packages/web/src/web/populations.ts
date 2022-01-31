export const getPopulationForAlpha3 = (alpha3: string) =>
  populations?.find((p) => p.iso === alpha3)?.population ?? null;

export const populations = [
  {
    iso: 'ABW',
    population: 106766
  },
  {
    iso: 'AFE',
    population: 677243299
  },
  {
    iso: 'AFG',
    population: 38928341
  },
  {
    iso: 'AFW',
    population: 458803476
  },
  {
    iso: 'AGO',
    population: 32866268
  },
  {
    iso: 'ALB',
    population: 2837743
  },
  {
    iso: 'AND',
    population: 77265
  },
  {
    iso: 'ARB',
    population: 436080728
  },
  {
    iso: 'ARE',
    population: 9890400
  },
  {
    iso: 'ARG',
    population: 45376763
  },
  {
    iso: 'ARM',
    population: 2963234
  },
  {
    iso: 'ASM',
    population: 55197
  },
  {
    iso: 'ATG',
    population: 97928
  },
  {
    iso: 'AUS',
    population: 25687041
  },
  {
    iso: 'AUT',
    population: 8917205
  },
  {
    iso: 'AZE',
    population: 10093121
  },
  {
    iso: 'BDI',
    population: 11890781
  },
  {
    iso: 'BEL',
    population: 11555997
  },
  {
    iso: 'BEN',
    population: 12123198
  },
  {
    iso: 'BFA',
    population: 20903278
  },
  {
    iso: 'BGD',
    population: 164689383
  },
  {
    iso: 'BGR',
    population: 6934015
  },
  {
    iso: 'BHR',
    population: 1701583
  },
  {
    iso: 'BHS',
    population: 393248
  },
  {
    iso: 'BIH',
    population: 3280815
  },
  {
    iso: 'BLR',
    population: 9379952
  },
  {
    iso: 'BLZ',
    population: 397621
  },
  {
    iso: 'BMU',
    population: 63903
  },
  {
    iso: 'BOL',
    population: 11673029
  },
  {
    iso: 'BRA',
    population: 212559409
  },
  {
    iso: 'BRB',
    population: 287371
  },
  {
    iso: 'BRN',
    population: 437483
  },
  {
    iso: 'BTN',
    population: 771612
  },
  {
    iso: 'BWA',
    population: 2351625
  },
  {
    iso: 'CAF',
    population: 4829764
  },
  {
    iso: 'CAN',
    population: 38005238
  },
  {
    iso: 'CEB',
    population: 102253057
  },
  {
    iso: 'CHE',
    population: 8636896
  },
  {
    iso: 'CHI',
    population: 173859
  },
  {
    iso: 'CHL',
    population: 19116209
  },
  {
    iso: 'CHN',
    population: 1410929362
  },
  {
    iso: 'CIV',
    population: 26378275
  },
  {
    iso: 'CMR',
    population: 26545864
  },
  {
    iso: 'COD',
    population: 89561404
  },
  {
    iso: 'COG',
    population: 5518092
  },
  {
    iso: 'COL',
    population: 50882884
  },
  {
    iso: 'COM',
    population: 869595
  },
  {
    iso: 'CPV',
    population: 555988
  },
  {
    iso: 'CRI',
    population: 5094114
  },
  {
    iso: 'CSS',
    population: 7442291
  },
  {
    iso: 'CUB',
    population: 11326616
  },
  {
    iso: 'CUW',
    population: 155014
  },
  {
    iso: 'CYM',
    population: 65720
  },
  {
    iso: 'CYP',
    population: 1207361
  },
  {
    iso: 'CZE',
    population: 10698896
  },
  {
    iso: 'DEU',
    population: 83240525
  },
  {
    iso: 'DJI',
    population: 988002
  },
  {
    iso: 'DMA',
    population: 71991
  },
  {
    iso: 'DNK',
    population: 5831404
  },
  {
    iso: 'DOM',
    population: 10847904
  },
  {
    iso: 'DZA',
    population: 43851043
  },
  {
    iso: 'EAP',
    population: 2113820753
  },
  {
    iso: 'EAR',
    population: 3332105361
  },
  {
    iso: 'EAS',
    population: 2360855079
  },
  {
    iso: 'ECA',
    population: 420211696
  },
  {
    iso: 'ECS',
    population: 923452178
  },
  {
    iso: 'ECU',
    population: 17643060
  },
  {
    iso: 'EGY',
    population: 102334403
  },
  {
    iso: 'EMU',
    population: 342949773
  },
  {
    iso: 'ESP',
    population: 47351567
  },
  {
    iso: 'EST',
    population: 1331057
  },
  {
    iso: 'ETH',
    population: 114963583
  },
  {
    iso: 'EUU',
    population: 447801418
  },
  {
    iso: 'FCS',
    population: 929989551
  },
  {
    iso: 'FIN',
    population: 5530719
  },
  {
    iso: 'FJI',
    population: 896444
  },
  {
    iso: 'FRA',
    population: 67391582
  },
  {
    iso: 'FRO',
    population: 48865
  },
  {
    iso: 'FSM',
    population: 115021
  },
  {
    iso: 'GAB',
    population: 2225728
  },
  {
    iso: 'GBR',
    population: 67215293
  },
  {
    iso: 'GEO',
    population: 3714000
  },
  {
    iso: 'GHA',
    population: 31072945
  },
  {
    iso: 'GIB',
    population: 33691
  },
  {
    iso: 'GIN',
    population: 13132792
  },
  {
    iso: 'GMB',
    population: 2416664
  },
  {
    iso: 'GNB',
    population: 1967998
  },
  {
    iso: 'GNQ',
    population: 1402985
  },
  {
    iso: 'GRC',
    population: 10715549
  },
  {
    iso: 'GRD',
    population: 112519
  },
  {
    iso: 'GRL',
    population: 56367
  },
  {
    iso: 'GTM',
    population: 16858333
  },
  {
    iso: 'GUM',
    population: 168783
  },
  {
    iso: 'GUY',
    population: 786559
  },
  {
    iso: 'HIC',
    population: 1214930230
  },
  {
    iso: 'HKG',
    population: 7481800
  },
  {
    iso: 'HND',
    population: 9904608
  },
  {
    iso: 'HPC',
    population: 823480038
  },
  {
    iso: 'HRV',
    population: 4047200
  },
  {
    iso: 'HTI',
    population: 11402533
  },
  {
    iso: 'HUN',
    population: 9749763
  },
  {
    iso: 'IBD',
    population: 4862388283
  },
  {
    iso: 'IBT',
    population: 6570991956
  },
  {
    iso: 'IDA',
    population: 1708603673
  },
  {
    iso: 'IDB',
    population: 574159138
  },
  {
    iso: 'IDN',
    population: 273523621
  },
  {
    iso: 'IDX',
    population: 1134444535
  },
  {
    iso: 'IMN',
    population: 85032
  },
  {
    iso: 'IND',
    population: 1380004385
  },
  {
    iso: 'IRL',
    population: 4994724
  },
  {
    iso: 'IRN',
    population: 83992953
  },
  {
    iso: 'IRQ',
    population: 40222503
  },
  {
    iso: 'ISL',
    population: 366425
  },
  {
    iso: 'ISR',
    population: 9216900
  },
  {
    iso: 'ITA',
    population: 59554023
  },
  {
    iso: 'JAM',
    population: 2961161
  },
  {
    iso: 'JOR',
    population: 10203140
  },
  {
    iso: 'JPN',
    population: 125836021
  },
  {
    iso: 'KAZ',
    population: 18754440
  },
  {
    iso: 'KEN',
    population: 53771300
  },
  {
    iso: 'KGZ',
    population: 6591600
  },
  {
    iso: 'KHM',
    population: 16718971
  },
  {
    iso: 'KIR',
    population: 119446
  },
  {
    iso: 'KNA',
    population: 53192
  },
  {
    iso: 'KOR',
    population: 51780579
  },
  {
    iso: 'KWT',
    population: 4270563
  },
  {
    iso: 'LAC',
    population: 595242966
  },
  {
    iso: 'LAO',
    population: 7275556
  },
  {
    iso: 'LBN',
    population: 6825442
  },
  {
    iso: 'LBR',
    population: 5057677
  },
  {
    iso: 'LBY',
    population: 6871287
  },
  {
    iso: 'LCA',
    population: 183629
  },
  {
    iso: 'LCN',
    population: 652276325
  },
  {
    iso: 'LDC',
    population: 1057438163
  },
  {
    iso: 'LIC',
    population: 665149035
  },
  {
    iso: 'LIE',
    population: 38137
  },
  {
    iso: 'LKA',
    population: 21919000
  },
  {
    iso: 'LMC',
    population: 3330652547
  },
  {
    iso: 'LMY',
    population: 6518253973
  },
  {
    iso: 'LSO',
    population: 2142252
  },
  {
    iso: 'LTE',
    population: 2316679176
  },
  {
    iso: 'LTU',
    population: 2794700
  },
  {
    iso: 'LUX',
    population: 632275
  },
  {
    iso: 'LVA',
    population: 1901548
  },
  {
    iso: 'MAC',
    population: 649342
  },
  {
    iso: 'MAF',
    population: 38659
  },
  {
    iso: 'MAR',
    population: 36910558
  },
  {
    iso: 'MCO',
    population: 39244
  },
  {
    iso: 'MDA',
    population: 2620495
  },
  {
    iso: 'MDG',
    population: 27691019
  },
  {
    iso: 'MDV',
    population: 540542
  },
  {
    iso: 'MEA',
    population: 464554123
  },
  {
    iso: 'MEX',
    population: 128932753
  },
  {
    iso: 'MHL',
    population: 59194
  },
  {
    iso: 'MIC',
    population: 5853104938
  },
  {
    iso: 'MKD',
    population: 2072531
  },
  {
    iso: 'MLI',
    population: 20250834
  },
  {
    iso: 'MLT',
    population: 525285
  },
  {
    iso: 'MMR',
    population: 54409794
  },
  {
    iso: 'MNA',
    population: 396147843
  },
  {
    iso: 'MNE',
    population: 621306
  },
  {
    iso: 'MNG',
    population: 3278292
  },
  {
    iso: 'MNP',
    population: 57557
  },
  {
    iso: 'MOZ',
    population: 31255435
  },
  {
    iso: 'MRT',
    population: 4649660
  },
  {
    iso: 'MUS',
    population: 1265740
  },
  {
    iso: 'MWI',
    population: 19129955
  },
  {
    iso: 'MYS',
    population: 32365998
  },
  {
    iso: 'NAC',
    population: 367553264
  },
  {
    iso: 'NAM',
    population: 2540916
  },
  {
    iso: 'NCL',
    population: 271960
  },
  {
    iso: 'NER',
    population: 24206636
  },
  {
    iso: 'NGA',
    population: 206139587
  },
  {
    iso: 'NIC',
    population: 6624554
  },
  {
    iso: 'NLD',
    population: 17441139
  },
  {
    iso: 'NOR',
    population: 5379475
  },
  {
    iso: 'NPL',
    population: 29136808
  },
  {
    iso: 'NRU',
    population: 10834
  },
  {
    iso: 'NZL',
    population: 5084300
  },
  {
    iso: 'OED',
    population: 1370858752
  },
  {
    iso: 'OMN',
    population: 5106622
  },
  {
    iso: 'OSS',
    population: 31941374
  },
  {
    iso: 'PAK',
    population: 220892331
  },
  {
    iso: 'PAN',
    population: 4314768
  },
  {
    iso: 'PER',
    population: 32971846
  },
  {
    iso: 'PHL',
    population: 109581085
  },
  {
    iso: 'PLW',
    population: 18092
  },
  {
    iso: 'PNG',
    population: 8947027
  },
  {
    iso: 'POL',
    population: 37950802
  },
  {
    iso: 'PRE',
    population: 970795671
  },
  {
    iso: 'PRI',
    population: 3194034
  },
  {
    iso: 'PRK',
    population: 25778815
  },
  {
    iso: 'PRT',
    population: 10305564
  },
  {
    iso: 'PRY',
    population: 7132530
  },
  {
    iso: 'PSE',
    population: 4803269
  },
  {
    iso: 'PSS',
    population: 2528958
  },
  {
    iso: 'PST',
    population: 1115104266
  },
  {
    iso: 'PYF',
    population: 280904
  },
  {
    iso: 'QAT',
    population: 2881060
  },
  {
    iso: 'ROU',
    population: 19286123
  },
  {
    iso: 'RUS',
    population: 144104080
  },
  {
    iso: 'RWA',
    population: 12952209
  },
  {
    iso: 'SAS',
    population: 1856882402
  },
  {
    iso: 'SAU',
    population: 34813867
  },
  {
    iso: 'SDN',
    population: 43849269
  },
  {
    iso: 'SEN',
    population: 16743930
  },
  {
    iso: 'SGP',
    population: 5685807
  },
  {
    iso: 'SLB',
    population: 686878
  },
  {
    iso: 'SLE',
    population: 7976985
  },
  {
    iso: 'SLV',
    population: 6486201
  },
  {
    iso: 'SMR',
    population: 33938
  },
  {
    iso: 'SOM',
    population: 15893219
  },
  {
    iso: 'SRB',
    population: 6908224
  },
  {
    iso: 'SSA',
    population: 1135948313
  },
  {
    iso: 'SSD',
    population: 11193729
  },
  {
    iso: 'SSF',
    population: 1136046775
  },
  {
    iso: 'SST',
    population: 41912623
  },
  {
    iso: 'STP',
    population: 219161
  },
  {
    iso: 'SUR',
    population: 586634
  },
  {
    iso: 'SVK',
    population: 5458827
  },
  {
    iso: 'SVN',
    population: 2100126
  },
  {
    iso: 'SWE',
    population: 10353442
  },
  {
    iso: 'SWZ',
    population: 1160164
  },
  {
    iso: 'SXM',
    population: 40812
  },
  {
    iso: 'SYC',
    population: 98462
  },
  {
    iso: 'SYR',
    population: 17500657
  },
  {
    iso: 'TCA',
    population: 38718
  },
  {
    iso: 'TCD',
    population: 16425859
  },
  {
    iso: 'TEA',
    population: 2088015667
  },
  {
    iso: 'TEC',
    population: 462209698
  },
  {
    iso: 'TGO',
    population: 8278737
  },
  {
    iso: 'THA',
    population: 69799978
  },
  {
    iso: 'TJK',
    population: 9537642
  },
  {
    iso: 'TKM',
    population: 6031187
  },
  {
    iso: 'TLA',
    population: 636492840
  },
  {
    iso: 'TLS',
    population: 1318442
  },
  {
    iso: 'TMN',
    population: 391344574
  },
  {
    iso: 'TON',
    population: 105697
  },
  {
    iso: 'TSA',
    population: 1856882402
  },
  {
    iso: 'TSS',
    population: 1136046775
  },
  {
    iso: 'TTO',
    population: 1399491
  },
  {
    iso: 'TUN',
    population: 11818618
  },
  {
    iso: 'TUR',
    population: 84339067
  },
  {
    iso: 'TUV',
    population: 11792
  },
  {
    iso: 'TZA',
    population: 59734213
  },
  {
    iso: 'UGA',
    population: 45741000
  },
  {
    iso: 'UKR',
    population: 44134693
  },
  {
    iso: 'UMC',
    population: 2522452391
  },
  {
    iso: 'URY',
    population: 3473727
  },
  {
    iso: 'USA',
    population: 329484123
  },
  {
    iso: 'UZB',
    population: 34232050
  },
  {
    iso: 'VCT',
    population: 110947
  },
  {
    iso: 'VEN',
    population: 28435943
  },
  {
    iso: 'VGB',
    population: 30237
  },
  {
    iso: 'VIR',
    population: 106290
  },
  {
    iso: 'VNM',
    population: 97338583
  },
  {
    iso: 'VUT',
    population: 307150
  },
  {
    iso: 'WLD',
    population: 7761620146
  },
  {
    iso: 'WSM',
    population: 198410
  },
  {
    iso: 'XKX',
    population: 1775378
  },
  {
    iso: 'YEM',
    population: 29825968
  },
  {
    iso: 'ZAF',
    population: 59308690
  },
  {
    iso: 'ZMB',
    population: 18383956
  },
  {
    iso: 'ZWE',
    population: 14862927
  }
] as const;

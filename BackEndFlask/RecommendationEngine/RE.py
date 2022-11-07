# RecommendationEngine.py
# Author: Vandan Sojitra(vandanp89@gmail.com)
# Find more documentation about API on https://documenter.getpostman.com/view/15905776/2s7YYr9kSK

import numpy as np
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
import random
from collections import Counter
import requests


class Recommend():

    def __init__(self, min_threshold=0.5):
        self._url = 'https://script.google.com/macros/s/AKfycbwesrsULT_ERfAPmqsTAaX34zWTqhdMRHa0ytCsJzdlF8lyvR7gVOGInOtmcTLa48U/exec'
        # self.action = "getAllOrdersList_CSV"
        self.action = "getAllOrdersListProducts_CSV"
        self.min_threshold = min_threshold
        self._APIurl = self._url + "?action="
        self.mappedProducts = {}
        self.mapProducts()

    def GetDataFrame(self):
        self.__dataFrame = pd.read_csv(
            self._APIurl+self.action, header=None, names=['products'])

        # splitting all rows by comma. Through this cell products are seperated
        data = list(self.__dataFrame["products"].apply(lambda x: x.split(',')))
        # for i in data:
        #     while("" in i):
        #         i.remove("")

        te = TransactionEncoder()
        te_data = te.fit(data).transform(data)
        df = pd.DataFrame(te_data, columns=te.columns_)

        self.allProducts = te.columns_

        return df

    def applyApriori(self):
        df = self.GetDataFrame()
        df_apr = apriori(df, min_support=0.01, use_colnames=True, verbose=0)
        df_apr['length'] = df_apr['itemsets'].apply(lambda x: len(x))

        return df_apr

    def applyAssociation(self, products=None, GetProductName=False):
        df_apr = self.applyApriori()

        result = association_rules(
            df_apr, metric="confidence", min_threshold=self.min_threshold)

        if(products is None):
            products = list(set(random.choices(self.allProducts, k=6)))

        else:
            tmp = pd.DataFrame(columns=['antecedents', 'consequents', 'antecedent support',
                                        'consequent support', 'support', 'confidence', 'lift', 'leverage', 'conviction'])
            for i in products:
                r = result[result['antecedents'].astype(str).str.contains(i)]
                tmp = tmp.append(r, ignore_index=True)

            tmp = tmp.sort_values(
                by='confidence', ascending=False).drop_duplicates()

        # tmp = result[result['antecedents'].astype(str).str.contains(product)]
        a = tmp['consequents']

        lst = []
        for i in a:
            lst.append(list(i))
        #     print(i)

        recommendation = []
        for ele in lst:
            for i in ele:
                if (i not in recommendation) & (i not in products):
                    recommendation.append(i)

        # if(GetProductName):
        #     tmp = []
        #     for i in recommendation:
        #         tmp.append(self.mappedProducts[i])
        #     recommendation = tmp.copy()
        #     tmp.clear()
        #     for i in products:
        #         tmp.append(self.mappedProducts[i])
        #     products = tmp.copy()

        res = {"products": products, "recommendations": recommendation,
               "min_threshold": self.min_threshold}

        return res

    def mapProducts(self):
        PARAMS = {'action': "getAllProducts"}

        r = requests.get(url=self._url, params=PARAMS)
        data = r.json()

        for i in data['data']:
            self.mappedProducts[str(i['ProductId'])] = i['ProductName']

    def greet(self):
        # print(self.__url)
        return "Hello! This is RecommendationEngine.\nI am developed by vandan sojitra"


class MostPurchased(Recommend):
    def __init__(self):
        super().__init__()

    def getMostOrderedItems(self, count=4):
        self.__dataFrame = pd.read_csv(
            self._url+self.action, header=None, names=['products'])

        data = list(self.__dataFrame["products"].apply(lambda x: x.split(',')))
        for i in data:
            while("" in i):
                i.remove("")

        pr_orders_count = {}

        for lst in data:
            for p in lst:
                if p not in pr_orders_count:
                    pr_orders_count[p] = 1
                else:
                    pr_orders_count[p] += 1
        # pr_orders_count

        high = Counter(pr_orders_count).most_common(count)
        result = []
        for i in high:
            result.append(i[0])
        return result

    def greet(self):
        return "Hello! This is MostPurchased."

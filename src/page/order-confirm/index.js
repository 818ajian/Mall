/*
 * @Author: FangFeiyue 
 * @Date: 2017-10-12 11:18:42 
 * @Last Modified by: FangFeiyue
 * @Last Modified time: 2017-10-12 18:47:35
 */
require("./index.css");
require("page/common/nav/index.js");
require("page/common/header/index.js");
var tool            = require("util/tool.js");
var templateProduct = require("./product-list.string");
var templateAddress = require("./address-list.string");
var _order          = require("service/order-service.js"); 
var _address        = require("service/address-service.js"); 
var page = {
    data: {
        selectedAddressId: null
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        // 加载地址列表
        this.loadAddressList();
        // 加载商品列表
        this.loadProductList(); 
    },
    bindEvent: function(){
        // 选择地址
        this.selectAddress(this);
        // 订单提交
        this.submitOrder(this);
    },
    // 加载地址列表 
    loadAddressList: function(){
        var _this = this;
        _address.getAddressList(function(res){
            var addressListHtml = tool.renderHtml(templateAddress, res);
            $('.address-con').html(addressListHtml);
        }, function(){
            $('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
        });
    },
    // 加载商品列表
    loadProductList: function(){
        var _this = this;
        _order.getProductList(function(res){
            var productListHtml = tool.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function(){
            $('.address-con').html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>');
        });
    },
    // 地址的选择
    selectAddress: function(_this){
        $(document).on('click', 'address-item', function(){
            $(this).addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');    
        });
    },
    // 订单提交
    submitOrder: function(_this){
        $(document).on('click', '.order-submit', function(){
             var shippingId = _this.data.selectedAddressId;
             
             if (!shippingId){
                _order.createOrder(shippingId, function(res){
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function(errMsg){
                    tool.errorTips(errMsg);
                });
             }else{
                 tool.errorTips('请您选择地址后再提交订单');
             }
        });
    }
}

$(function(){
    page.init();
});
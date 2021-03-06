/**
 * Created by xiaowuzai on 2018/3/2.
 */
import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,TouchableOpacity,ScrollView,Alert,DeviceEventEmitter} from 'react-native';
import CheckBox from 'react-native-check-box';

import NavigationBar from './../../common/NavigationBar.js';
import ViewUtil from './../../util/ViewUtil.js';
import LanguangeDao,{FLAG_LANGUAGE} from './../../expand/dao/LanguangeDao.js';
import ArrayUtil from '../../util/ArrayUtil.js';

import {ACTION_HOME,FLAG_TAB} from './../HomePage.js'

export default class CustomKey extends Component{
    constructor(props){
        super(props)
        this.languageDao=new LanguangeDao(this.props.navigation.state.params.flag);
        this.changedValues=[];
        this.isRemove=this.props.navigation.state.params.isRemove
        this.state={
            data:[],
            theme:this.props.navigation.state.params.theme
        }
    };
    static navigationOptions={
        //headerTitle:'PopularPage'
        header:null
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        this.languageDao.fetch().then(result=>{
            this.setState({data:result})
        }).catch(e=>console.log(e))
    }

    onSave(){
        let {navigate,goBack}=this.props.navigation;
        if(this.changedValues.length==0){
            goBack();
            return;
        };
        if(this.isRemove){
            for(let i=0;i<this.changedValues.length;i++){
                ArrayUtil.remove(this.state.data,this.changedValues[i])
            };
        };
        this.languageDao.save(this.state.data)
        //goBack();
        let jumpToTab=this.props.navigation.state.params.flag==FLAG_LANGUAGE.flag_key?FLAG_TAB.flag_popularTab:FLAG_TAB.flag_trending
        DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART,{jumpToTab:'homePage'})
    }
    onBack(){
        let {navigate,goBack}=this.props.navigation;
        if(this.changedValues.length==0){
            goBack();
            return;
        };
        Alert.alert(
            '提示',
            '要保存修改吗？',
            [
                {text: '不保存', onPress: () => goBack(), style: 'cancel'},
                {text: '保存', onPress: () => this.onSave()},
            ],
            { cancelable: false }
        )
    }
    renderView(){
        if(!this.state.data || this.state.data.length===0){
            return null;
        };
        let len=this.state.data.length;
        let views=[];
        for(let i=0;i<len-2;i+=2){
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.data[i])}
                        {this.renderCheckBox(this.state.data[i+1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        };

        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2==0?this.renderCheckBox(this.state.data[len-2]):null}
                    {this.renderCheckBox(this.state.data[len-1])}
                </View>
                <View style={styles.line}></View>
            </View>
        )
        return views;
    }
    onClick(data){
        if(!this.isRemove){
            data.checked=!data.checked
        };
        ArrayUtil.updataArray(this.changedValues,data);
    }
    renderCheckBox(data){
        let leftText=data.name;
        let checked=this.isRemove?false:data.checked;
        console.log('params:'+this.props.navigation.state.params.theme.themeColor)
        return(
            <CheckBox
                style={{flex:1,padding:10}}
                onClick={()=>this.onClick(data)}
                leftText={leftText}
                isChecked={checked}
                checkedImage={<Image source={require('./img/ic_check_box.png')} style={{tintColor:this.state.theme.themeColor}}/>}
                unCheckedImage={<Image source={require('./img/ic_check_box_outline_blank.png')} style={{tintColor:this.state.theme.themeColor}}/>}
            />
        )
    }

    render(){
        let title=this.props.navigation.state.params.title;
        let btnTxt=this.props.navigation.state.params.btnTxt;
        let statusBar=this.state.theme.styles.navBar
        console.log('CustomKey:'+this.state.theme.themeColor)
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    statusBar={{backgroundColor:this.state.theme.themeColor}}
                    style={statusBar}
                    leftButton={
                        ViewUtil.getLeftButton(()=>{this.onBack()})
                    }
                    rightButton={
                        <TouchableOpacity onPress={()=>{this.onSave()}}>
                             <View>
                                <Text style={styles.title}>{btnTxt}</Text>
                             </View>
                        </TouchableOpacity>
                    }
                    />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        fontSize:18,
        color:'white'
    },
    line:{
        height:1,
        backgroundColor:'darkgray'
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
        height:30
    }
});

/*
react-native bundle --entry-file index.ios.js --bundle-output ./ios/bundle/index.ios.jsbundle --platform ios
--assets-dest ./ios/bundle --dev false

 */
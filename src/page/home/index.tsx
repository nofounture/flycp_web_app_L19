import React, { useState, useEffect } from 'react'
import { NavBar,Swiper,Button,NoticeBar,Grid,Image,Tabs,TabBar,Badge,Divider,Dialog} from 'antd-mobile'
import { 
	AlipaySquareFill,
	EditSFill,
	HeartFill,
	MessageFill,
	FireFill,
	AppstoreOutline,
	ReceivePaymentOutline,
	ContentOutline,
	MessageOutline,
	UserOutline,
	CheckShieldFill,
	SoundOutline,
	RightOutline,
	ShopbagOutline,
	GiftOutline,
	MovieOutline
} from 'antd-mobile-icons'

import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import {
  getHomeList,getMsgCount
} from '../../store';
import "./index.css"
import Auth from '../../lib/Auth';
import Check from '../../lib/Check'
import About from '../about'
import { setLoading,setMsgCount } from '../../store';		
import {useDispatch } from 'react-redux';
import { relative } from 'path';
let interval:any = 0
export default () => {
	const {notice,img,list,kefu,website_logo2,website_hot} = useSelector(getHomeList);
	const msgCount = useSelector(getMsgCount)
	const dispatch = useDispatch()
  const navigate = useNavigate()
  
	// console.log('msgCount',msgCount)
	// const onNavigate=(path:string)=>{
	// 	if(localStorage.getItem("token")){
	// 		navigate(path)
	// 	}else{
	// 		navigate('/login')
	// 	}
	// }
	const items = img.map((imgUrl:string, index:any) => (
		<Swiper.Item key={index}>
			<Image className={"img-content"} lazy src={imgUrl} />
		</Swiper.Item>
	))
	const hotImg = (<Image lazy src="/app/hot.gif" width={15} fit='none' />)
	// const gameList = list.map((game:any, index:any) => (
	// 	<Badge content={hotImg} className='home-hot' style={{'--right':'20px','--top':'15px'}} key={index}>
	// 		<Grid.Item  onClick={()=>{navigate("/hall/k3/"+game.name)}}>
	// 				<div style={{margin:"10px",textAlign:"center"}}>
	// 					<Image className={"img-list"} lazy src={game.img} />
	// 					<div className='home-game-name'>{game.title}</div>
	// 				</div>

	// 		</Grid.Item>
	// 	</Badge>
	// ))
	const checkLogin=()=>{
		if(localStorage.getItem("token")){
			return true;
		}else{
			Dialog.alert({
				content: <div className='check-login'>
					<h3>温馨提示</h3>
					<div>请先登录才能查看</div>
				</div>,
				onConfirm: () => {
					// console.log('Confirmed')
				},
			})
		}
	}

	const gameList1 = list.map((game:any, index:any) =>{
		if(index < 8){
			return (
				<Grid.Item  onClick={()=>{if(checkLogin())navigate("/hall/k3/"+game.name)}}>
					<div className='sc-itme'>
						<div className='sc-itme-img'>
							<div className='sc-badge'>
								<Badge content={website_hot==''?<></>:<Image src={website_hot} />} style={{
									'--right': '-20px',"--color":"none",width:25}}>
									<Image  src={game.img} />
								</Badge>
							</div>
						</div>
						
						
						<div className='sc-itme-desc'>{game.desc}</div>
						<div className='sc-itme-title'>{game.title}</div>
					</div>
				</Grid.Item>
			)
		}
	} )
	// console.log(website_hot)
	const gameList2 = list.map((game:any, index:any) =>{
		if(index>7){
			return (
				<Grid.Item  onClick={()=>{if(checkLogin())navigate("/hall/k3/"+game.name)}}>
					<div className='sc-item'>
						<div className='sc-item-img'>
							<div className='sc-badge'>
								<Badge content={website_hot==''?<></>:<Image src={website_hot} />} style={{'--right': '-20px',"--color":"none",width:25}}>
									<Image  src={game.img} />
								</Badge>
							</div>
						</div>
						
						<div className='sc-item-title'>{game.title}</div>
						<div className='sc-item-desc'>{game.desc}</div>
						
					</div>
				</Grid.Item>
			)
		}
	} )
	useEffect(() => {
		Check(navigate)
		if(list.length == 0){
			dispatch(setLoading(true))
		}else{
			dispatch(setLoading(false))
		}
  },[list])
	// const gameList2 = list.map((game:any, index:any) => (
	// 	<Grid.Item key={index} onClick={()=>{navigate("/hall/k3/"+game.name)}}>
	// 		<div style={{margin:"10px",textAlign:"center"}}>
	// 			<Image className={"img-list"} lazy src={game.img} />
	// 			<div className='home-game-name'>{game.title}</div>
	// 		</div>

	// 	</Grid.Item>
	// ))
	const getPingInfo = function(){
		if(localStorage.getItem("token")){
			Auth.ajax(navigate,'user/ping')
			.then(function (response:any) {
				if(msgCount != response.message){
					dispatch(setMsgCount(response.message))
				}
				let userInfo:any = JSON.parse(localStorage.getItem("userInfo")??'{"balance":0.00}')
				userInfo.balance = response.balance
				localStorage.setItem("userInfo", JSON.stringify(userInfo))
			})

		}
	}
	useEffect(() => {
		
		getPingInfo()
		if(!interval){
			console.log('启动定时器')
			window.clearInterval(interval)
			interval = window.setInterval(() => {
				getPingInfo()
			}, 30000);
		}
  },[])
	let right = (
		<div 
			onClick={() => {
				navigate("/login/null");
			}} 
			style={{ fontSize: 16,marginRight:"10px" }}
		>
			登录
		</div>
	)
	let left = (
		<>
		<Button size='mini' color='primary' style={{"--border-color":"#eee",'--text-color':"#fff"}} fill='outline' onClick={() => {
				navigate("/login/null");
			}}  >
			登录
		</Button>
		&nbsp;&nbsp;
		<Button size='mini' color='primary' style={{"--border-color":"#eee",'--text-color':"#fff"}} fill='outline' onClick={() => {
				navigate("/register");
			}}   >
			注册
		</Button>
		</>
		
	)
	if(localStorage.getItem("token")){
		right = (<></>)
		// left = (<><UserOutline style={{fontSize:"20px"}} /></>)
		left = (<></>)
	}
	const tabs = [
    {
      key: '/',
      title: '首页',
      icon: <Image className='sc-m-img' src="/assets/m1.png" />,
    },
    // {
    //   key: '/withdraw',
    //   title: '兑换',
    //   icon: <ReceivePaymentOutline />,
    // },
    // {
    //   key: '/open',
    //   title: '历史记录',
    //   icon: <ContentOutline />,
    // },
    {
      key: '/mall/0',
      title: '购物中心',
      icon: <Image className='sc-m-img' src="/assets/m2.png" />,
    },
    {
	key: '/message',
      title: '消息',
      icon: <Image className='sc-m-img' src="/assets/m3.png" />,
			badge: msgCount,
    },
    {
      key: '/user',
      title: '个人中心',
      icon: <Image className='sc-m-img' src="/assets/m4.png" />,
    },
  ]

	return (
		<div className='App-main'>
			<header className={"App-header"}  >
				<NavBar           style={{
            '--height': '45px',
			background:'linear-gradient(90deg,#cba16d,#d9bd9e)'
          }} backArrow={false} left={website_logo2==''?<></>:<Image className='home-logo' fit='contain' src={website_logo2}/>} right={left}>
					<div style={{ fontSize: 20 }}></div>
				</NavBar>
			</header>
			<div className='App-content' style={{height:window.innerHeight-95}}>
				<div className='img-content'>
					<Swiper autoplay loop indicatorProps={{
              color: 'white',
            }}>{items}</Swiper>
		
				</div>

				<div className='home-menu'> 
					<Grid className='menu' columns={4} gap={0} style={{marginTop:10}}>
						<Grid.Item className='sc-button'  onClick={()=>{if(checkLogin())navigate("/mall/0")}}>
							<Image className='sc-button-img' src="/assets/1.png" />
							<div>热销商家</div>
						</Grid.Item>
						<Grid.Item className='sc-button' onClick={()=>{if(checkLogin())Auth.navigate(navigate,"/activity")}}>
							<Image className='sc-button-img' src="/assets/2.png" />
							<div>本周特惠</div>
						</Grid.Item>
						<Grid.Item className='sc-button' onClick={()=>{if(checkLogin())Auth.navigate(navigate,"/record")}}>
							<Image className='sc-button-img' src="/assets/3.png" />
							<div>我的订单</div>
						</Grid.Item>
						<Grid.Item className='sc-button' onClick={()=>{window.location.href = kefu}}>
							<Image className='sc-button-img' src="/assets/4.png" />
							<div>在线客服</div>
						</Grid.Item>
					</Grid>
					<Image className='bg'  src="/assets/bg.png" />
				</div>
				<div onClick={()=>{if(checkLogin())Auth.navigate(navigate,"/notice")}} style={{marginTop:10}}>
					<NoticeBar 
						icon={<div style={{width:'20px'}}><Image  src="/assets/icon.png" /></div>} style={{ 
							border:'unset',
							marginLeft:20,
							marginRight:20,
							borderRadius:10,
							fontSize: 14,'--height':'32px','--background-color':'#fff'}} 
						content={notice}  />
				</div>

				<div className='home-game-body'>
					<Image className='sc-youhui' src="/assets/prev.png" />
					<div className='home-list' style={{backgroundImage:'url("/assets/bgList.png")'}}>
					<Grid columns={2} gap={5} className='sc-type-list'>
						<Grid.Item className='sc-type'  onClick={()=>{if(checkLogin())navigate("/mall/1")}}>
							<div className='sc-type-name' style={{ backgroundImage: 'url("/assets/bgBtnItem.png")'}}>
								<div className='title'>公益专区</div>
								<div className='desc'>好物不错过</div>
								<div className='btn' 
								 style={{ backgroundImage: 'url("/assets/btn.png")'}}
								>
								立即疯抢 &gt;
								</div>
								<Image className='sc-img' src="/assets/a1.png" />
								
								</div>
						</Grid.Item>
						<Grid.Item className='sc-type'   onClick={()=>{if(checkLogin())navigate("/mall/2")}}>
						<div className='sc-type-name' style={{ backgroundImage: 'url("/assets/bgBtnItem.png")'}}>
								<div className='title'>公益专区</div>
								<div className='desc'>好物不错过</div>
								<div className='btn' 
								 style={{ backgroundImage: 'url("/assets/btn.png")'}}
								>
								立即疯抢 &gt;
								</div>
								<Image className='sc-img' src="/assets/a2.png" />
								
								</div>
						</Grid.Item>
						<Grid.Item className='sc-type'   onClick={()=>{if(checkLogin())navigate("/mall/3")}}>
						<div className='sc-type-name' style={{ backgroundImage: 'url("/assets/bgBtnItem.png")'}}>
								<div className='title'>公益专区</div>
								<div className='desc'>好物不错过</div>
								<div className='btn' 
								 style={{ backgroundImage: 'url("/assets/btn.png")'}}
								>
								立即疯抢 &gt;
								</div>
								<Image className='sc-img' src="/assets/a3.png" />
								
								</div>
						</Grid.Item>
						<Grid.Item className='sc-type'  onClick={()=>{if(checkLogin())navigate("/mall/4")}}>
						<div className='sc-type-name' style={{ backgroundImage: 'url("/assets/bgBtnItem.png")'}}>
								<div className='title'>公益专区</div>
								<div className='desc'>好物不错过</div>
								<div className='btn' 
								 style={{ backgroundImage: 'url("/assets/btn.png")'}}
								>
								立即疯抢 &gt;
								</div>
								<Image className='sc-img' src="/assets/a4.png" />
								
								</div>
						</Grid.Item>
					</Grid>
					</div>
					
					<Image className='sc-youhui' src="/assets/prev2.png" onClick={()=>{if(checkLogin())navigate("/mall/0")}} />
					{/* <br/> */}
					{/* <Image className='sc-jxhw'  src="/sc/jxhw.png" /> */}
					<Divider className='dy-type' style={{padding:0}}>精选好物</Divider>
					<Grid columns={2} gap={10} style={{marginTop:10,padding:"0 5px"}}>
						{gameList1}
					</Grid>
					{/* <Image className='sc-jxhw'  src="/sc/hdzq.png" /> */}
					
					<Divider className='dy-type'>活动专区</Divider>
					<Grid columns={2} gap={10} style={{marginTop:10,padding:"0 5px"}}>
						{gameList2}
					</Grid>
				</div>
			</div>
			<div className='App-footer'>
				<TabBar 			
					onChange={(key: string) => {
						if(key == '/'){
							return
						}
						if(key == '/kefu'){
							window.location.href = kefu
						}else{
							if(checkLogin())Auth.navigate(navigate,key);
						}
					}}  
				>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} badge={item.badge} />
            // <TabBar.Item key={item.key} icon={item.icon} title={item.title}  />
          ))}
        </TabBar>
			</div>
		</div>
	)
}


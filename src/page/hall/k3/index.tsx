import React, { useState,useEffect } from 'react'
import { NavBar,Toast,Mask,Divider,Image,Popup,Button,Grid,Dialog,Space,Input,DotLoading,Popover} from 'antd-mobile'
import {
  useNavigate,useParams
} from 'react-router-dom'
import axios from 'axios';
import Qs from 'qs'
import './index.css'
import { 
	DownOutline,QuestionCircleOutline,MoreOutline
} from 'antd-mobile-icons'
import UserList from "./userList"
import Api from '../../../lib/Api';
import { Action } from 'antd-mobile/es/components/popover'
import {
  UnorderedListOutline,
  FileOutline,
  ScanningOutline,
  TransportQRcodeOutline,
} from 'antd-mobile-icons'


export default () => {
	const params = useParams() 
	const [gameList, setGameList] = useState<{}[]>([])
	const [k3Wanfa, setK3Wanfa] = useState<any[]>([])
	const [gameData, setGameData] = useState<any>({})
  const [visible2, setVisible2] = useState(false)
	const [visibleSheet, setVisibleSheet] = useState(false)
  const [countdownTime, setCountdownTime] = useState<number>(0)
  const [showTime, setShowTime] = useState("-- : --")
  const [showHistory, setShowHistory] = useState("none")
  const [historyList, setHistoryList] = useState<any[]>([])
  const [alertNumber, setAlertNumber] = useState(5)
  const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [gameName, setGameName] = useState(params['name'])
  let [timer, setTimer] = useState(0);
	let [touzhu, setTouzhu] = useState<any>({})
	const [k3hzsmall, setK3hzsmall] = useState(false)
	const [value, setValue] = useState('')
	const userInfo:any = JSON.parse(localStorage.getItem("userInfo")??'{"balance":0.00}')
	let navigate = useNavigate()
	let gameListHtml = (<></>)
	let selectGameHtml = (<></>)
	let kjHistoryHtml = (<></>)
	let kjHistoryList = (<></>)
	let alertHtml = (<></>)
	let cardHtml = (<></>)
	let HzHtml = (<></>)
	let touzhuHtml = (<></>)
	let loadingHtml = (<></>)
	let previousOpen = (<></>)
	let rightHtml = (<></>)
  // 使用 useEffect 监听 countDown 变化
  useEffect(() => {
		if(!visibleSheet){
			setVisibleSheet(true)
		}
    if (countdownTime > 0) {
      const newTimer = window.setInterval(() => {
				let t = countdownTime-1;
				let i:any = ~~(t/60)
				let s:any = t%60
				let ss = s
				if(i<10){
					i = "0"+i
				}
				if(s<10){
					s = "0"+s
				}
				setShowTime(i+":"+s);
				setCountdownTime(t)
				
				if(t <= 5 ){
					setAlertNumber(ss)
					if(!visible && t==5){
						setVisible(true)
					}
				}
        if (t <= 1) {
					setVisible(false)
					Dialog.clear()
					console.log('倒计时介绍')
					getHtmlData(gameName,false)
          window.clearInterval(newTimer);
        } 
      }, 1000);

      setTimer(newTimer);
    }
  }, [countdownTime]);

  // 组件销毁清除倒计时
  useEffect(() => {
    return () => window.clearInterval(timer);
  }, [timer]);


	useEffect(() => {
		getHtmlData(gameName)
	},[])


  const back = () =>{
		
		navigate("/")
		// navigate(-1);
	}

	// 号码html
	if( k3Wanfa.length != 0){
		cardHtml = (<>
			<Grid columns={4} gap={8} className='hz-card-body'>
				{k3Wanfa.map((item:any, index:any) => (
					<Grid.Item key={index} onClick={()=>{selectNumber(item.playid,item.title)}}>
						<div className={touzhu[item.playid]?"hz-card-activity":"hz-card"}>
							{item.title}
							<div className={touzhu[item.playid]?"hz-card-number-activity":"hz-card-number"}>{item.rate}</div>
						</div>
					</Grid.Item>
				))}
			</Grid>
		</>)
	}

	// 选择号码
	const selectNumber = (typeid:string,value:string)=>{
		k3hzsmall?setK3hzsmall(false):setK3hzsmall(true)
		// console.log(typeid,value)
		let tmp = {...touzhu}
		if(tmp[typeid]){
			delete tmp[typeid]
		}else{
			tmp[typeid] = value
		}
		console.log(tmp)
		setTouzhu(tmp)
	}


	// 游戏数据
	const getHtmlData = function(name:any,showLoading:boolean=true){
		window.clearInterval(timer)
		setCountdownTime(0)
		setShowTime("--:--");
		let values = {
			name:name
		}
		if(showLoading){
			setLoading(true)
		}
		axios.post(Api.address()+'home/hall', Qs.stringify(values))
		.then(function (response) {
			setLoading(false)
			if(response.data.code == 0){
				setGameList(response.data.data.hall)
				setGameData(response.data.data.game)
				setHistoryList(response.data.data.game.history)
				setCountdownTime(response.data.data.game.countdown)
				setK3Wanfa(response.data.data.game.wanfa)
				setTimeout(()=>{
					updateOpenData()
				},20000)
			}else{
				Toast.show({
					icon: 'fail',
					content: response.data.msg,
				})
			}
		})
		.catch(function (error) {
			setLoading(false)	
			Toast.show({
				icon: 'fail',
				content: '服务繁忙，稍后再试！',
			})
		})
	}
	const updateOpenData = ()=>{
		const values={
			"page": 1,
			"cptitel": gameName,
			"limit": 10
		}
		axios.post(Api.address()+'home/history', Qs.stringify(values))
		.then(function (response) {
			setLoading(false)
			if(response.data.code == 0){
				setHistoryList(response.data.data)
			}else{
				Toast.show({
					icon: 'fail',
					content: response.data.msg,
				})
			}
		})
	}

	//投注提交
	const submit = ()=>{
		if(gameData.qishu == '0'){
			Toast.show({
				icon: 'fail',
				content: "封盘中，无法投注",
			})
			return
			
		}
		let amount = Number(value)
		let values = {
			token:localStorage.getItem("token"),
			touzhu:touzhu,
			amount:amount,
			qishu:gameData.qishu,
			name:gameData.name,
			typeid:'k3'
		}
		// console.log(values)
		if(Object.keys(touzhu).length == 0){
			Toast.show({
				icon: 'fail',
				content: "请选择号码！",
			})
			return
		}
		if(!values.token){
			Toast.show({
				icon: 'fail',
				content: "您尚未登陆！",
			})
			return
		}
		
		if(!amount){
			Toast.show({
				icon: 'fail',
				content: "请输入投注金额！",
			})
			return
		}
		if(amount<2){
			Toast.show({
				icon: 'fail',
				content: "最低投注金额2元！",
			})
			return
		}
		
		setLoading(true)
		axios.post(Api.address()+'user/touzhu', Qs.stringify(values))
		.then(function (response) {
			setLoading(false)
			if(response.data.code == 0){
				userInfo.balance = response.data.data.balance
				localStorage.setItem("userInfo", JSON.stringify(userInfo))
				setTouzhu({})
				Toast.show({
					icon: 'success',
					content: "投注成功",
				})
			}else{
				if(212 == response.data.code){
					getHtmlData(gameName)
					Toast.show({
						icon: 'fail',
						content: "当前期号已更新，请重新投注！",
					})
				}else{
					Toast.show({
						icon: 'fail',
						content: response.data.msg,
					})
				}
			}
		})
		.catch(function (error) {
			setLoading(false)
			Toast.show({
				icon: 'fail',
				content: '服务繁忙，稍后再试！',
			})
		})
	}

	// 清空、机选
	const clearTouzhu = ()=>{
		if(Object.keys(touzhu).length == 0){
			// 机选
			let item = k3Wanfa[Math.floor(Math.random()*k3Wanfa.length)];
			let playid = item["playid"]
			setTouzhu({[playid]:item['title']})
		}else{
			setTouzhu({})
		}
	}

	const howPlay=() =>
		Dialog.alert({
			content: (<>
				<div className='k3-howplay-title'>&diams;	玩法提示</div>
				<div className='k3-howplay-txt'>至少选择1个和值（3个号码之和）进行投注。</div>
				<Divider />
				<div className='k3-howplay-title'>&diams;	返佣说明</div>
				<div className='k3-howplay-txt'>所选和值与开奖的3个号码的和值相同即中奖。</div>
				<Divider />
				<div className='k3-howplay-title'>&diams;	范例</div>
				<div className='k3-howplay-txt'>
					选号：和大 <br/>
					开奖结果数字相加在11－18的范围内即为中奖。 <br/>
					开奖号码：3 4 6 <br/>
					和值为13 <br/>
					----------------<br/>
					选号：和小 <br/>
					开奖结果数字相加在3－10的范围内即为中奖。 <br/>
					开奖号码：1 2 4<br/>
					和值为7 <br/>
				</div>
			</>),
			onConfirm: () => {
			},
		})
	

	// 投注倒计时
	alertHtml = (<>
		<div className='ks-alert-body'>
			<div className='ks-alert-qs1'>
				距 {gameData.qishu} 期
			</div>
			<div className='ks-alert-qs1'>
				投注截至
			</div>
			<div className='ks-alert-number'>
				{alertNumber}
			</div>
			<div className='ks-alert-qs2'>
				投注时请注意当前期号
			</div>
			<Button  size='small' color='danger' onClick={()=>setVisible(false)}>知道了</Button>
		</div>
	</>)
	
	// 选择彩种
	if(gameList.length > 0){
		gameListHtml = (<>
			 <Grid columns={3} gap={8} className='k3-name-list-body'>
				{gameList.map((item:any, index) => (
					<Grid.Item className="k3-name-list" key={index}>
						<Button 
							onClick={(p)=>{
								setVisible2(false)
								// getHtmlData(item.name)
								// setGameName(item.name)
								navigate("/hall/k3/"+item.name)
							}}
							color='primary' 
							fill='outline' 
							className={gameData.title == item.title?"k3-name-list-button-active":"k3-name-list-button"}
						>
							{item.title}
						</Button>
					</Grid.Item>
				))}

			 </Grid>
			
		</>)

	}
	

	if( Object.keys(gameData).length != 0){
		selectGameHtml = (				
			<Button
				className='k3-name-button'
				onClick={() => {
					setVisible2(true)
				}}
			>
				{gameData.title}<DownOutline />
			</Button>
		)
		if(historyList.length > 0){
			let item = historyList[0]
			previousOpen = (<>
				<div className='k3-kj-qs' 
					onClick={()=>{
						showHistory=="none"?setShowHistory("block"):setShowHistory("none")
					}}
				>
					{item.expect} 期开奖&nbsp;<DownOutline style={{transform : showHistory=="none"?"rotate(0deg)":"rotate(180deg)"}}/></div>
				<div>
					<Grid columns={3} gap={5} className='k3-kj-img'>
						<Grid.Item>
							<Image  src={"/k3/"+item.opencode[0]+".png"} />
						</Grid.Item>
						<Grid.Item>
							<Image  src={"/k3/"+item.opencode[1]+".png"} />
						</Grid.Item>
						<Grid.Item>
							<Image  src={"/k3/"+item.opencode[2]+".png"} />
						</Grid.Item>
					</Grid>
				</div>
			</>)

		}
		// 历史开奖
		kjHistoryList =(<>{
			historyList.map((item:any,index:any)=>{return(
				<Grid columns={7} gap={15} className={"k3-kj-history-row-"+(index%2)} key={index}>
					<Grid.Item span={2} >
						{item.expect}
					</Grid.Item>
					<Grid.Item span={2}>
						<Grid columns={3} gap={5} className='k3-kj-history-img'>
							<Grid.Item>
								<Image  src={"/k3/"+item.opencode[0]+".png"} />
							</Grid.Item>
							<Grid.Item>
								<Image  src={"/k3/"+item.opencode[1]+".png"} />
							</Grid.Item>
							<Grid.Item>
								<Image  src={"/k3/"+item.opencode[2]+".png"} />
							</Grid.Item>
						</Grid>
					</Grid.Item>
					<Grid.Item >
						{item.hz}
					</Grid.Item>
					<Grid.Item >
						{item.dx}
					</Grid.Item>
					<Grid.Item>
						{item.ds}
					</Grid.Item>
				</Grid>
			)})
		}</>) 
		kjHistoryHtml = (<div className='ks-kj-history'>
			<Grid columns={7} gap={15}>
				<Grid.Item span={2} className='ks-kj-history-qs'>
					期数
				</Grid.Item>
				<Grid.Item span={2}>
					开奖号码
				</Grid.Item>
				<Grid.Item>
					和值
				</Grid.Item>
				<Grid.Item>
					大小
				</Grid.Item>
				<Grid.Item>
					单双
				</Grid.Item>
			</Grid>
		</div>)
	}
	
	// 和值html
	HzHtml = (<>
		<div style={{overflow: "hidden"}}>
			<div className='hz-playinfo' onClick={howPlay}>
				<QuestionCircleOutline />&nbsp;玩法说明
			</div>
		</div>
		{cardHtml}
	</>)

	// 投注html
	touzhuHtml = (<>
	
		<div className='touzhu-number' style={{'display':Object.keys(touzhu).length==0?"none":"block"}}> 
			<div>
				<Space wrap className='touzhu-number-row'>
					<div>当前选号</div>
					{k3Wanfa.map((item:any,index:number)=>{
						if(touzhu[item.playid]){
							return  (
								<div key={index} className='touzhu-number-select'>{item.title}</div>
							)
						}
					})}
				</Space>
			</div>
			<Divider style={{margin: "5px 0"}} />
			<div>
				<Space  className='touzhu-number-row'>
					每注金额
					<Input
						placeholder='请输每注金额'
						value={value}
						type="number"
						onChange={val => {
							if(Number(val) > 1000000){
								setValue('')
								Toast.show({
									content: '最高投注金额100万',
									afterClose: () => {
										console.log('after')
									},
								})
							}
							setValue(val)
						}}
					/>
				</Space>
			</div>
		</div>
		<div className='touzhu-footer'>
			<Grid columns={4} gap={8}>
				<Grid.Item className='touzhu-button-left'>
					<Button color='primary' fill='outline' size='small' onClick={clearTouzhu}>
						{
							Object.keys(touzhu).length==0?'机选':"删除"
						}
            
          </Button>
				</Grid.Item>
				<Grid.Item span={2}>
					<div>
						<Space wrap className='touzhu-button-glod'>
							<div className='touzhu-button-number'>{ Object.keys(touzhu).length}</div><div>注</div>
							<div className='touzhu-button-number'>{ Number(value)*Object.keys(touzhu).length}</div><div>元</div>
						</Space>
					</div>
					<div>
						<Space wrap className='touzhu-button-glod'>
							<div>余额：</div>
							<div className='touzhu-button-number'>{userInfo.balance}</div>
						</Space>
					</div>
				</Grid.Item>
				<Grid.Item  className='touzhu-button-right'>
					<Button color='danger'  size='small' onClick={submit} loading={loading}>确定</Button>
				</Grid.Item>
			</Grid>
		</div>
	</>)

	// 加载中
	loadingHtml = (<>
		<Mask visible={loading} className='App-loading'>
			<DotLoading style={{color:"#f00"}} />
		</Mask>
	</>)
	let qishu = '0 期';
	if(gameData.qishu == '0'){
		qishu="封盘中"
	}else if(Object.keys(gameData).length){
		qishu = gameData.qishu+"期"
	}
	
	const actions: Action[] = [
		{ key: '/record', icon:  <></>, text: '任务记录' },
		{ key: '/open/history', icon: <></>, text: '开奖记录' }
	]
	//报错？？？ 需要后加载组件
	if(visibleSheet){
		rightHtml = (				
		<Popover.Menu
			actions={actions}
			placement='bottom-start'
			onAction={node =>{ 
				// Toast.show(`选择了 ${node.text}`)
				if(node.key == '/record' ){
					if(!localStorage.getItem('token')){
						Toast.show({
							icon: 'fail',
							content: '您尚未登录',
						})
						return
					}
					navigate('/record')
				}
				if(node.key == '/open/history'){
					navigate('/open/history/'+gameName)
				}
			}}
			trigger='click'
		>
			<div style={{ fontSize: 35 }} onClick={()=>setVisibleSheet(true)}>
				<MoreOutline />
			</div>
		</Popover.Menu>
		)
	}
  return (
		<div className='App-main'>
			<header className="App-header"  >
				<NavBar className='app-header' onBack={back} right={rightHtml}>
					{selectGameHtml}
				</NavBar>
			</header>
			<div className='App-content' style={{height:window.innerHeight-95,background:"#fff"}}>
				
				<>
					<Mask visible={visible} 
						// onMaskClick={() => setVisible(false)}
					>
						{alertHtml}
					</Mask>
					{loadingHtml}
					<Popup
						className='k3-popup'
						visible={visible2}
						onMaskClick={() => {
							setVisible2(false)
						}}
						// position='top'
						// bodyStyle={{ height: '40vh' }}
					>
						{gameListHtml}
					</Popup>
				</>
				
				<Grid columns={2} gap={8} className='k3-kj'>
          <Grid.Item>
						<div className='k3-kj-qs'>{qishu}</div>
						<div className='k3-kj-time'>{showTime}</div>
          </Grid.Item>
          <Grid.Item>
						{previousOpen}
          </Grid.Item>
        </Grid>
				<div style={{display:showHistory}}>
					{kjHistoryHtml}
					{kjHistoryList}
				</div>
				<Divider className='k3-name-list-head' />
				{HzHtml}
				<Divider/>
				<UserList/>
			</div>
			<div className='App-footer'>
				{touzhuHtml}
			</div>
		</div>
  )
}
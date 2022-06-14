import React, { useState,useEffect } from 'react'
import { NavBar,Toast,Tag,Image,Empty,Grid} from 'antd-mobile'
import {
  useNavigate,
	useParams,
} from 'react-router-dom'
import './index.css'
import Auth from '../../lib/Auth';
import { setLoading } from '../../store'
import {useDispatch } from 'react-redux'
export default () => {
	const params = useParams() 
	const [htmlData, setHtmlData] = useState<any>({})
	const dispatch = useDispatch()
	let navigate = useNavigate()
	Auth.page(navigate)
	let html

	useEffect(() => {
		getHtmlData()
	},[])
  const back = () =>{
		navigate(-1);
	}
	const getHtmlData = function(){
		dispatch(setLoading(true))
		Auth.ajax(navigate,'record/info',{id:params['id']})
		.then(function (response) {
			dispatch(setLoading(false))
			setHtmlData(response)
		}).catch(function (error) {
			dispatch(setLoading(false))
		})
	}

	if( Object.keys(htmlData).length != 0){
		html = (<div className='record-info-body'>
      <Image lazy src={htmlData.img} width={220} className='record-info-img'/>
			<div className='record-info-title'>{htmlData.cptitle}</div>
			<div className='record-info-expect'>{htmlData.expect}</div>
			<br/>
			<br/>
			<Grid columns={7} gap={16} >
				<Grid.Item span={3} className='record-info-key'>
					项目状态:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>					
					{(htmlData.isdraw=="1"?<Tag color='danger' fill='outline'>
						已中奖 
					</Tag>:"")}
					{(htmlData.isdraw=="0"?<Tag color='primary' fill='outline'>
						未开奖
					</Tag>:"")}
					{(htmlData.isdraw=="-1"?<Tag color='success' fill='outline'>
						未中奖
					</Tag>:"")}
					{(htmlData.isdraw=="-2"?<Tag color='default' fill='outline'>
						已撤单
					</Tag>:"")}
					{(htmlData.isdraw=="-3"?<Tag color='default' fill='outline'>
						已作废
					</Tag>:"")}
				</Grid.Item>
				
				<Grid.Item span={3} className='record-info-key'>
				中奖金额:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.okamount}
				</Grid.Item>
				<Grid.Item span={3} className='record-info-key'>
				项目号码:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.ztcode}
				</Grid.Item>
				<Grid.Item span={3} className='record-info-key'>
				开奖号码:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.opencode}
				</Grid.Item>
				<Grid.Item span={3} className='record-info-key'>
				操作时间:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.oddtime}
				</Grid.Item>
				<Grid.Item span={3} className='record-info-key'>
				游戏玩法:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.playtitle}
				</Grid.Item>
				<Grid.Item span={3} className='record-info-key'>
				项目金额:
				</Grid.Item>
				<Grid.Item span={4} className='record-info-value'>
					{htmlData.amount}
				</Grid.Item>
			</Grid>
		</div>)

	}else{
		html = (<>
      <Empty />
		</>)
	}

	
	return (
		<div className='App-main'>
			<header className="App-header"  >
      	<NavBar  onBack={back}>项目详情</NavBar>
			</header>
			<div className='App-content' style={{height:window.innerHeight-45,background:"#fff"}}>
				{html}
			</div>
		</div>
	)
}
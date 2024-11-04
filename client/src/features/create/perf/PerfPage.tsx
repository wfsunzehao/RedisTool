import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import swal from "sweetalert";
import agent from "../../../app/api/agent";
import { PerfModel } from "../../../common/models/DataModel";
import { Overlay, subscriptionList } from "../../../common/constants/constants";
import LoadingComponent from "../../../common/components/CustomLoading";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { handleGenericSubmit } from "../../../app/util/util";

const PerfPage: React.FC = () => {
  // 获取当前日期，并将其格式化为 MMDD
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 获取月份并补零
  const day = String(today.getDate()).padStart(2, "0"); // 获取日期并补零
  const formattedDate = `${month}${day}`; // 格式化为 MMDD
  const [subscription, setSubscription] = useState("");
  const [group, setGroup] = useState("");
  const [name, setName] = useState(""); // 用于 BVT 的 name
  const [region, setRegion] = useState(""); // 用于 BVT 的 region
  const [quantity, setQuantity] = useState(""); // 用于 MAN 的数量
  const [time, setTime] = useState(""); // 用于 PERF 的时间
  const [cacheName, setCacheName] = useState(
    `Verifyperformance-{SKU}-EUS2E-${formattedDate}`
  );
  const [loading, setLoading] = useState(false);
  const [sku, setSku] = useState("All");
  const [groupList, setGroupList] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handlenameChange = (event: SelectChangeEvent) => {
    setCacheName(event.target.value as string);
  };
  const handleskuChange = (event: SelectChangeEvent) => {
    setSku(event.target.value as string);
  };
  //初始化
  useEffect(() => {
    //默认显示Cache Team - Vendor CTI Testing 2
    setSubscription("1e57c478-0901-4c02-8d35-49db234b78d2");
    setRegion("East US 2 EUAP");
    agent.Create.getGroup("1e57c478-0901-4c02-8d35-49db234b78d2")
      .then((response) => {
        setGroupList(response);
      })
      .catch((error) => console.log(error.response));
  }, []);

  //校验表单
  const CheckForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!subscription) newErrors.subscription = "订阅不能为空";
    if (!group) newErrors.group = "组不能为空";
    if (!region) newErrors.region = "地区不能为空";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 返回是否有错误
  };

  const apiPathFunction = async (data: PerfModel) => {
    return await agent.Create.sendPerfJson(data); 
  };
  const handleSubmit = (event: React.FormEvent) => {
      // 提交逻辑
      const data: PerfModel = {
        subscription: subscription,
        group: group,
        sku: sku,
      };      
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading); 
  };
  // 处理取消按钮点击事件
  const handleCancel = () => {
    setSubscription("");
    setGroup("");
    setName("");
    setQuantity("");
    setRegion("");
    setErrors({}); // 重置错误信息
  };

  // 处理列表项点击事件
  //   const handleListItemClick = (formName: string) => {
  //     setSelectedForm(formName);
  //     // 重置输入框，当选择不同表单时
  //     setSubscription('');
  //     setGroup('');
  //     setName('');
  //     setQuantity('');
  //     setRegion('');//清空地区
  //     setErrors({}); // 清空错误信息
  //   };
  // 处理下拉框改变事件
  const handleSubChange = (subscriptionid: string) => {
    setSubscription(subscriptionid);
    agent.Create.getGroup(subscriptionid)
      .then((response) => {
        setGroupList(response);
      })
      .catch((error) => console.log(error.response));
  };
  return (
    <Box>
      <p style={{ color: "#1976d2", fontSize: "30px", textAlign: "center" }}>
        创建：Perf Cache
      </p>
      <form className="submit-box" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <TextField
              select
              label={`Subscription`}
              value={subscription}
              onChange={(e) => handleSubChange(e.target.value)}
              variant="outlined"
              error={!!errors.subscription} // 判断是否有错误
              helperText={errors.subscription} // 显示错误信息
              fullWidth
            >
              {subscriptionList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <InputLabel id="cacheName-simple-select-label">
              CacheName
            </InputLabel>
            <Select
              labelId="cacheName-select-label"
              id="cacheName-select"
              value={cacheName}
              label="cacheName"
              onChange={handlenameChange}
            >
              <MenuItem value={cacheName}>{cacheName}</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <TextField
              select
              label="Group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              variant="outlined"
              error={!!errors.group} // 判断是否有错误
              helperText={errors.group} // 显示错误信息
              fullWidth
            >
              {groupList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <TextField
              select
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              variant="outlined"
              error={!!errors.region} // 判断是否有错误
              helperText={errors.region} // 显示错误信息
              fullWidth
            >
              {["East US 2 EUAP"].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <InputLabel id="sku-simple-select-label">SKU</InputLabel>
            <Select
              labelId="sku-simple-select-label"
              id="sku-simple-select"
              value={sku}
              label="sku"
              onChange={handleskuChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* 其他相关表单字段 */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mx: 1 }}
          >
            提交
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ mx: 1 }}
          >
            取消
          </Button>
        </Box>
      </form>
      {loading && (
        <Overlay>
          <LoadingComponent />
        </Overlay>
      )}
    </Box>
  );
};

export default PerfPage;

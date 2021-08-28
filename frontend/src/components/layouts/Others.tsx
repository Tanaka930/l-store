import { useState, useEffect } from "react"
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import moment from 'moment'
import Cookies from "js-cookie"
import { Box, Container, Card, CardContent, CardHeader, Paper, TextField, Button, Divider, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core"
import PostAddIcon from '@material-ui/icons/PostAdd';
import CloseIcon from '@material-ui/icons/Close'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AlertMessage from "components/utils/AlertMessage"

type TabPanelProps = {
  index: number
  value: number
  userId: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiCardHeader-title': {
        fontSize: 24,
      },
      '& .MuiCardHeader-root': {
        textAlign: "center",
        padding: 0,
        paddingBottom: 9
      },
      '& .MuiPaper-root': {
        marginBottom: 24
      }
    },
  }),
)

const Others = (props: TabPanelProps) => {
  const { value, index, userId } = props
  const [edit, setEdit] = useState(false)
  const [memos, setMemos] =useState<any[]>([])
  const { handleSubmit, control, reset } = useForm()
  const classes = useStyles()
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState(false);

  const config = {
    headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid")
    }
  }

  const handleToggleButton = () => {
    setEdit(prevState => !prevState)
  }

  const handleEditButton = (id: number) => {
    setEdit(true)
  }

  const handleDeleteButton = (id: number) => {
    console.log(`${id}delete ok`)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const getMemos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/line_customers/${userId}/memos`, config)
      if (response.status === 200) {
        setMemos(response.data)
        console.log(response.data)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const onSubmit = async (values: any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/line_customers/${userId}/memos`, values, config)
      if (response.status === 200) {
        getMemos()
        setAlertMessageOpen(true)
        setEdit(false)
        reset()
      } else {
        toast.error("更新に失敗しました")
      }
    } catch(err) {
      toast.warn("通信に失敗しました")
      console.error(err)
    }
  }

  useEffect(() => {
    getMemos()
  }, [])

  return (
    <>
      {value === index && (
        <Box py={3} className={classes.root}>
          <Container maxWidth="sm">
            <Card>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  px: 1
                }}
              >
                <IconButton onClick={handleToggleButton}>
                  { edit ? <CloseIcon /> : <PostAddIcon /> }
                </IconButton>
              </Box>
              <CardHeader
                title="備考欄"
                subheader={edit && "メモ情報がある場合はご記入ください"}
              />
              <Divider variant="middle" />
                { edit ? (
                  <>
                    <CardContent>
                      <form
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <Controller
                          name="body"
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              name="body"
                              label="備考"
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={9}
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                        <Box sx={{mt: 3}}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            type="submit"
                          >
                            保存
                          </Button>
                        </Box>
                      </form>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardContent>
                      {memos.map((memo, index) => (
                        <Paper
                          key={index}
                          elevation={2}
                        >
                          <Box sx={{pt: 2, px:2}}>
                            <Typography
                              color="textPrimary"
                            >
                              {memo.body}
                            </Typography>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                              display="block"
                              align="right"
                            >
                              {moment(memo.updated_at).format('YYYY/MM/DD')}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <IconButton onClick={() => handleEditButton(memo.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteButton(memo.id)}>
                              <DeleteForeverIcon />
                            </IconButton>
                          </Box>
                        </Paper>
                      ))}
                    </CardContent>
                    <Dialog
                      open={openDialog}
                      onClose={handleDialogClose}
                    >
                      <DialogTitle>削除します</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          削除してもよろしいでしょうか？
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleDialogClose} color="inherit">
                          キャンセル
                        </Button>
                        <Button onClick={handleDialogClose} color="secondary">
                          削除
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <AlertMessage
                      open={alertMessageOpen}
                      setOpen={setAlertMessageOpen}
                      severity="success"
                      message="メモを投稿しました。"
                      vertical="bottom"
                      horizontal="right"
                    />
                    <ToastContainer
                      position="bottom-right"
                      autoClose={5000}
                      hideProgressBar
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover={false}
                    />
                  </>
                )}
            </Card>
          </Container>
        </Box>
      )}
    </>
  )
}

export default Others
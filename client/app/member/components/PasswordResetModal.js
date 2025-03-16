import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function PasswordResetModal({ show, onClose, userEmail = '' }) {
  const [step, setStep] = useState(1); // 1 = 發送驗證碼, 2 = 輸入新密碼
  const [email, setEmail] = useState(userEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 每次開啟 Modal，初始化 email 和 step
  useEffect(() => {
    if (show) {
      setStep(1);
      setEmail(userEmail);
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }
  }, [show, userEmail]);

  // 發送驗證碼
  const handleSendCode = async () => {
    if (!email) {
      toast.error('請輸入電子郵件');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:3005/api/member/users/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("✅ 驗證碼已寄出！");
        setStep(2); // ➡️ 切換到輸入驗證碼 + 新密碼步驟
      } else {
        toast.error(result.message || "❌ 驗證碼寄送失敗");
      }
    } catch (err) {
      toast.error("❌ 系統錯誤，無法寄送驗證碼");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 提交新密碼
  const handleSubmitPassword = async () => {
    if (!verificationCode || !newPassword || !confirmPassword) {
      toast.error('❌ 請填寫所有欄位！');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('❌ 兩次輸入的密碼不一致！');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:3005/api/member/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: verificationCode,
          password: newPassword
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("✅ 密碼已成功修改！");
        handleClose(); // 關閉 Modal
      } else {
        toast.error(result.message || "❌ 密碼重設失敗");
      }
    } catch (err) {
      toast.error("❌ 系統錯誤，無法重設密碼");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 關閉 Modal 並重置狀態
  const handleClose = () => {
    setStep(1);
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{step === 1 ? '發送驗證碼' : '修改密碼'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {step === 1 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                value={email}
                readOnly // 如果固定測試帳號可以這樣，不然就刪掉
                placeholder="請輸入您的 Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSendCode}
              disabled={isLoading || !email}
              className="w-100"
            >
              {isLoading ? '發送中...' : '發送驗證碼'}
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>驗證碼</Form.Label>
              <Form.Control
                type="text"
                placeholder="請輸入收到的驗證碼"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>確認新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="再次輸入新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleSubmitPassword}
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? '提交中...' : '提交修改'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

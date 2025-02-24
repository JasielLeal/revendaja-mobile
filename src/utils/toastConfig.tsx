import { CustomToast } from '@/components/CustomToast';

export const toastConfig = {
    success: (props: any) => (
        <CustomToast 
            type="success" 
            message={props.text1} 
            description={props.text2}
            {...props}
        />
    ),
    error: (props: any) => (
        <CustomToast 
            type="error" 
            message={props.text1} 
            description={props.text2}
            {...props}
        />
    ),
};
